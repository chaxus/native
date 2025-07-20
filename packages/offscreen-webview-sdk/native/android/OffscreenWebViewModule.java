package com.native.offscreenwebview;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.ValueCallback;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceError;
import android.util.Base64;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.ByteArrayOutputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class OffscreenWebViewModule extends ReactContextBaseJavaModule {
    private static final String TAG = "OffscreenWebViewModule";
    private final ReactApplicationContext reactContext;
    private final Map<String, WebView> webViews = new ConcurrentHashMap<>();
    private final Map<String, Promise> pendingPromises = new ConcurrentHashMap<>();

    public OffscreenWebViewModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "OffscreenWebViewModule";
    }

    @ReactMethod
    public void createInstance(String instanceId, ReadableMap config, Promise promise) {
        try {
            WebView webView = createWebView(instanceId, config);
            webViews.put(instanceId, webView);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("CREATE_ERROR", "Failed to create WebView instance", e);
        }
    }

    @ReactMethod
    public void loadUrl(String instanceId, String url, Promise promise) {
        WebView webView = webViews.get(instanceId);
        if (webView == null) {
            promise.reject("NOT_FOUND", "WebView instance not found");
            return;
        }

        try {
            webView.loadUrl(url);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("LOAD_ERROR", "Failed to load URL", e);
        }
    }

    @ReactMethod
    public void loadHTML(String instanceId, String html, String baseURL, Promise promise) {
        WebView webView = webViews.get(instanceId);
        if (webView == null) {
            promise.reject("NOT_FOUND", "WebView instance not found");
            return;
        }

        try {
            webView.loadDataWithBaseURL(baseURL, html, "text/html", "UTF-8", null);
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("LOAD_ERROR", "Failed to load HTML", e);
        }
    }

    @ReactMethod
    public void executeJavaScript(String instanceId, String script, Promise promise) {
        WebView webView = webViews.get(instanceId);
        if (webView == null) {
            promise.reject("NOT_FOUND", "WebView instance not found");
            return;
        }

        try {
            webView.evaluateJavascript(script, new ValueCallback<String>() {
                @Override
                public void onReceiveValue(String value) {
                    promise.resolve(value);
                }
            });
        } catch (Exception e) {
            promise.reject("JS_ERROR", "JavaScript execution failed", e);
        }
    }

    @ReactMethod
    public void captureScreenshot(String instanceId, Promise promise) {
        WebView webView = webViews.get(instanceId);
        if (webView == null) {
            promise.reject("NOT_FOUND", "WebView instance not found");
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

            promise.resolve(base64);
        } catch (Exception e) {
            promise.reject("SCREENSHOT_ERROR", "Failed to capture screenshot", e);
        }
    }

    @ReactMethod
    public void getPageContent(String instanceId, Promise promise) {
        executeJavaScript(instanceId, "document.documentElement.outerHTML", promise);
    }

    @ReactMethod
    public void getPageTitle(String instanceId, Promise promise) {
        executeJavaScript(instanceId, "document.title", promise);
    }

    @ReactMethod
    public void getCurrentUrl(String instanceId, Promise promise) {
        WebView webView = webViews.get(instanceId);
        if (webView == null) {
            promise.reject("NOT_FOUND", "WebView instance not found");
            return;
        }

        try {
            String url = webView.getUrl();
            promise.resolve(url != null ? url : "");
        } catch (Exception e) {
            promise.reject("URL_ERROR", "Failed to get current URL", e);
        }
    }

    @ReactMethod
    public void goBack(String instanceId, Promise promise) {
        WebView webView = webViews.get(instanceId);
        if (webView == null) {
            promise.reject("NOT_FOUND", "WebView instance not found");
            return;
        }

        try {
            boolean canGoBack = webView.canGoBack();
            if (canGoBack) {
                webView.goBack();
            }
            promise.resolve(canGoBack);
        } catch (Exception e) {
            promise.reject("NAVIGATION_ERROR", "Failed to go back", e);
        }
    }

    @ReactMethod
    public void goForward(String instanceId, Promise promise) {
        WebView webView = webViews.get(instanceId);
        if (webView == null) {
            promise.reject("NOT_FOUND", "WebView instance not found");
            return;
        }

        try {
            boolean canGoForward = webView.canGoForward();
            if (canGoForward) {
                webView.goForward();
            }
            promise.resolve(canGoForward);
        } catch (Exception e) {
            promise.reject("NAVIGATION_ERROR", "Failed to go forward", e);
        }
    }

    @ReactMethod
    public void reload(String instanceId, Promise promise) {
        WebView webView = webViews.get(instanceId);
        if (webView == null) {
            promise.reject("NOT_FOUND", "WebView instance not found");
            return;
        }

        try {
            webView.reload();
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("RELOAD_ERROR", "Failed to reload", e);
        }
    }

    @ReactMethod
    public void stopLoading(String instanceId, Promise promise) {
        WebView webView = webViews.get(instanceId);
        if (webView == null) {
            promise.reject("NOT_FOUND", "WebView instance not found");
            return;
        }

        try {
            webView.stopLoading();
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("STOP_ERROR", "Failed to stop loading", e);
        }
    }

    @ReactMethod
    public void destroy(String instanceId, Promise promise) {
        try {
            WebView webView = webViews.remove(instanceId);
            if (webView != null) {
                webView.stopLoading();
                webView.loadUrl("about:blank");
                webView.destroy();
            }
            promise.resolve(null);
        } catch (Exception e) {
            promise.reject("DESTROY_ERROR", "Failed to destroy WebView", e);
        }
    }

    private WebView createWebView(String instanceId, ReadableMap config) {
        WebView webView = new WebView(reactContext);
        
        // 配置 WebView 设置
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        
        // 设置用户代理
        if (config.hasKey("userAgent")) {
            settings.setUserAgentString(config.getString("userAgent"));
        }
        
        // 设置尺寸
        if (config.hasKey("width") && config.hasKey("height")) {
            int width = config.getInt("width");
            int height = config.getInt("height");
            webView.setLayoutParams(new android.view.ViewGroup.LayoutParams(width, height));
        }

        // 设置 WebViewClient
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                sendEvent(instanceId, "onLoadStart", createEventData("url", url));
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                sendEvent(instanceId, "onLoadEnd", createEventData("url", url));
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                WritableMap errorData = Arguments.createMap();
                errorData.putString("url", request.getUrl().toString());
                errorData.putString("error", error.getDescription().toString());
                sendEvent(instanceId, "onError", errorData);
            }
        });

        // 设置 WebChromeClient
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                WritableMap progressData = Arguments.createMap();
                progressData.putInt("progress", newProgress);
                sendEvent(instanceId, "onProgress", progressData);
            }

            @Override
            public void onReceivedTitle(WebView view, String title) {
                sendEvent(instanceId, "onTitleChange", createEventData("title", title));
            }
        });

        // 注入初始 JavaScript
        if (config.hasKey("injectedJavaScript")) {
            String injectedScript = config.getString("injectedJavaScript");
            webView.evaluateJavascript(injectedScript, null);
        }

        return webView;
    }

    private WritableMap createEventData(String key, String value) {
        WritableMap data = Arguments.createMap();
        data.putString(key, value);
        return data;
    }

    private void sendEvent(String instanceId, String eventName, WritableMap data) {
        WritableMap eventData = Arguments.createMap();
        eventData.putString("instanceId", instanceId);
        eventData.putMap("data", data);

        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
            .emit(instanceId + ":" + eventName, eventData);
    }
} 