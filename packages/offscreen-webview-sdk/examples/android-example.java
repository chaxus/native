import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.util.Base64;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.ValueCallback;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceError;
import android.content.Context;
import android.util.Log;

import java.io.ByteArrayOutputStream;
import java.util.concurrent.CompletableFuture;

// Android 原生使用示例
public class OffscreenWebViewExample {
    
    private static final String TAG = "OffscreenWebViewExample";
    private WebView webView;
    private final Context context;
    private final String instanceId = "android-example-instance";
    
    public OffscreenWebViewExample(Context context) {
        this.context = context;
    }
    
    // 创建离屏 WebView
    public void createOffscreenWebView() {
        webView = new WebView(context);
        
        // 配置 WebView 设置
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        
        // 设置用户代理
        settings.setUserAgentString("OffscreenWebView/1.0");
        
        // 设置尺寸（离屏，不添加到视图层级）
        webView.setLayoutParams(new android.view.ViewGroup.LayoutParams(375, 667));
        
        // 设置 WebViewClient
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                Log.d(TAG, "🔄 页面开始加载: " + url);
            }
            
            @Override
            public void onPageFinished(WebView view, String url) {
                Log.d(TAG, "✅ 页面加载完成: " + url);
                
                // 获取页面标题
                getPageTitle(title -> {
                    Log.d(TAG, "📄 页面标题: " + title);
                });
            }
            
            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                Log.e(TAG, "❌ 页面加载失败: " + error.getDescription());
            }
        });
        
        // 设置 WebChromeClient
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                Log.d(TAG, "📊 加载进度: " + newProgress + "%");
            }
            
            @Override
            public void onReceivedTitle(WebView view, String title) {
                Log.d(TAG, "📄 页面标题变化: " + title);
            }
        });
        
        // 注入初始 JavaScript
        String injectedScript = "console.log('Offscreen WebView initialized'); " +
                               "window.ReactNativeWebView = { " +
                               "  postMessage: (data) => { console.log('Message from WebView:', data); } " +
                               "};";
        webView.evaluateJavascript(injectedScript, null);
        
        Log.d(TAG, "🚀 WebView 实例创建成功");
    }
    
    // 加载 URL
    public void loadUrl(String url) {
        if (webView == null) {
            Log.e(TAG, "WebView not initialized");
            return;
        }
        
        webView.loadUrl(url);
    }
    
    // 加载 HTML 内容
    public void loadHTML(String html, String baseURL) {
        if (webView == null) {
            Log.e(TAG, "WebView not initialized");
            return;
        }
        
        webView.loadDataWithBaseURL(baseURL, html, "text/html", "UTF-8", null);
    }
    
    // 执行 JavaScript
    public void executeJavaScript(String script, ValueCallback<String> callback) {
        if (webView == null) {
            Log.e(TAG, "WebView not initialized");
            if (callback != null) {
                callback.onReceiveValue(null);
            }
            return;
        }
        
        webView.evaluateJavascript(script, callback);
    }
    
    // 获取页面截图
    public void captureScreenshot(ScreenshotCallback callback) {
        if (webView == null) {
            Log.e(TAG, "WebView not initialized");
            if (callback != null) {
                callback.onScreenshot(null, new Exception("WebView not initialized"));
            }
            return;
        }
        
        try {
            // 创建位图
            Bitmap bitmap = Bitmap.createBitmap(webView.getWidth(), webView.getHeight(), Bitmap.Config.ARGB_8888);
            Canvas canvas = new Canvas(bitmap);
            webView.draw(canvas);
            
            // 转换为 Base64
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, byteArrayOutputStream);
            byte[] byteArray = byteArrayOutputStream.toByteArray();
            String base64 = Base64.encodeToString(byteArray, Base64.DEFAULT);
            
            if (callback != null) {
                callback.onScreenshot(base64, null);
            }
            
            Log.d(TAG, "📸 截图成功，尺寸: " + bitmap.getWidth() + "x" + bitmap.getHeight());
        } catch (Exception e) {
            Log.e(TAG, "截图失败: " + e.getMessage());
            if (callback != null) {
                callback.onScreenshot(null, e);
            }
        }
    }
    
    // 获取页面内容
    public void getPageContent(ValueCallback<String> callback) {
        executeJavaScript("document.documentElement.outerHTML", callback);
    }
    
    // 获取页面标题
    public void getPageTitle(ValueCallback<String> callback) {
        executeJavaScript("document.title", callback);
    }
    
    // 获取当前 URL
    public String getCurrentUrl() {
        return webView != null ? webView.getUrl() : null;
    }
    
    // 导航操作
    public boolean goBack() {
        if (webView == null) return false;
        
        boolean canGoBack = webView.canGoBack();
        if (canGoBack) {
            webView.goBack();
        }
        return canGoBack;
    }
    
    public boolean goForward() {
        if (webView == null) return false;
        
        boolean canGoForward = webView.canGoForward();
        if (canGoForward) {
            webView.goForward();
        }
        return canGoForward;
    }
    
    public void reload() {
        if (webView != null) {
            webView.reload();
        }
    }
    
    public void stopLoading() {
        if (webView != null) {
            webView.stopLoading();
        }
    }
    
    // 销毁实例
    public void destroy() {
        if (webView != null) {
            webView.stopLoading();
            webView.loadUrl("about:blank");
            webView.destroy();
            webView = null;
            Log.d(TAG, "🧹 WebView 实例已销毁");
        }
    }
    
    // 回调接口
    public interface ScreenshotCallback {
        void onScreenshot(String base64Data, Exception error);
    }
}

// 使用示例
class OffscreenWebViewUsageExample {
    
    public static void runExample(Context context) {
        OffscreenWebViewExample example = new OffscreenWebViewExample(context);
        
        // 1. 创建 WebView 实例
        example.createOffscreenWebView();
        
        // 2. 加载页面
        example.loadUrl("https://reactnative.dev");
        
        // 3. 等待页面加载完成后执行操作
        // 注意：在实际应用中，应该通过 WebViewClient 的回调来处理
        new android.os.Handler().postDelayed(() -> {
            // 执行 JavaScript
            example.executeJavaScript(
                "document.title = 'Modified by Android SDK'; document.title;",
                result -> {
                    Log.d("Example", "🎯 JavaScript 执行结果: " + result);
                }
            );
            
            // 获取页面内容
            example.getPageContent(content -> {
                if (content != null) {
                    Log.d("Example", "📝 页面内容长度: " + content.length() + " 字符");
                }
            });
            
            // 截图
            example.captureScreenshot((base64Data, error) -> {
                if (base64Data != null) {
                    Log.d("Example", "📸 截图成功，Base64 长度: " + base64Data.length());
                    // 这里可以保存图片或进行其他处理
                } else {
                    Log.e("Example", "截图失败: " + error.getMessage());
                }
            });
        }, 3000); // 延迟 3 秒
        
        // 4. 清理资源
        new android.os.Handler().postDelayed(() -> {
            example.destroy();
        }, 10000); // 延迟 10 秒
    }
} 