import Foundation
import WebKit
import UIKit

// iOS 原生使用示例
class OffscreenWebViewExample {
    
    private var webView: WKWebView?
    private let instanceId = "ios-example-instance"
    
    // 创建离屏 WebView
    func createOffscreenWebView() {
        let configuration = WKWebViewConfiguration()
        configuration.preferences.javaScriptEnabled = true
        
        // 设置用户代理
        configuration.applicationNameForUserAgent = "OffscreenWebView/1.0"
        
        // 创建 WebView（离屏，不添加到视图层级）
        webView = WKWebView(frame: CGRect(x: 0, y: 0, width: 375, height: 667), configuration: configuration)
        webView?.navigationDelegate = self
        
        // 注入初始 JavaScript
        let injectedScript = """
            console.log('Offscreen WebView initialized');
            window.ReactNativeWebView = {
                postMessage: (data) => {
                    console.log('Message from WebView:', data);
                }
            };
        """
        webView?.evaluateJavaScript(injectedScript)
    }
    
    // 加载 URL
    func loadUrl(_ url: String) {
        guard let webView = webView, let url = URL(string: url) else {
            print("Invalid URL or WebView not initialized")
            return
        }
        
        let request = URLRequest(url: url)
        webView.load(request)
    }
    
    // 加载 HTML 内容
    func loadHTML(_ html: String, baseURL: String? = nil) {
        guard let webView = webView else {
            print("WebView not initialized")
            return
        }
        
        let baseURLValue = baseURL != nil ? URL(string: baseURL!) : nil
        webView.loadHTMLString(html, baseURL: baseURLValue)
    }
    
    // 执行 JavaScript
    func executeJavaScript(_ script: String, completion: @escaping (Any?, Error?) -> Void) {
        guard let webView = webView else {
            completion(nil, NSError(domain: "WebViewError", code: -1, userInfo: [NSLocalizedDescriptionKey: "WebView not initialized"]))
            return
        }
        
        webView.evaluateJavaScript(script, completionHandler: completion)
    }
    
    // 获取页面截图
    func captureScreenshot(completion: @escaping (UIImage?, Error?) -> Void) {
        guard let webView = webView else {
            completion(nil, NSError(domain: "WebViewError", code: -1, userInfo: [NSLocalizedDescriptionKey: "WebView not initialized"]))
            return
        }
        
        DispatchQueue.main.async {
            let renderer = UIGraphicsImageRenderer(bounds: webView.bounds)
            let image = renderer.image { context in
                webView.layer.render(in: context.cgContext)
            }
            completion(image, nil)
        }
    }
    
    // 获取页面内容
    func getPageContent(completion: @escaping (String?, Error?) -> Void) {
        executeJavaScript("document.documentElement.outerHTML") { result, error in
            completion(result as? String, error)
        }
    }
    
    // 获取页面标题
    func getPageTitle(completion: @escaping (String?, Error?) -> Void) {
        executeJavaScript("document.title") { result, error in
            completion(result as? String, error)
        }
    }
    
    // 获取当前 URL
    func getCurrentUrl() -> String? {
        return webView?.url?.absoluteString
    }
    
    // 导航操作
    func goBack() -> Bool {
        guard let webView = webView else { return false }
        let canGoBack = webView.canGoBack
        if canGoBack {
            webView.goBack()
        }
        return canGoBack
    }
    
    func goForward() -> Bool {
        guard let webView = webView else { return false }
        let canGoForward = webView.canGoForward
        if canGoForward {
            webView.goForward()
        }
        return canGoForward
    }
    
    func reload() {
        webView?.reload()
    }
    
    func stopLoading() {
        webView?.stopLoading()
    }
    
    // 销毁实例
    func destroy() {
        webView?.stopLoading()
        webView?.loadHTMLString("", baseURL: nil)
        webView = nil
    }
}

// MARK: - WKNavigationDelegate
extension OffscreenWebViewExample: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
        print("🔄 页面开始加载: \(webView.url?.absoluteString ?? "")")
    }
    
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        print("✅ 页面加载完成: \(webView.url?.absoluteString ?? "")")
        
        // 获取页面标题
        getPageTitle { title, error in
            if let title = title {
                print("📄 页面标题: \(title)")
            }
        }
    }
    
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print("❌ 页面加载失败: \(error.localizedDescription)")
    }
}

// MARK: - 使用示例
func runOffscreenWebViewExample() {
    let example = OffscreenWebViewExample()
    
    // 1. 创建 WebView 实例
    example.createOffscreenWebView()
    print("🚀 WebView 实例创建成功")
    
    // 2. 加载页面
    example.loadUrl("https://reactnative.dev")
    
    // 3. 等待页面加载完成后执行操作
    DispatchQueue.main.asyncAfter(deadline: .now() + 3.0) {
        // 执行 JavaScript
        example.executeJavaScript("document.title = 'Modified by iOS SDK'; document.title;") { result, error in
            if let title = result as? String {
                print("🎯 JavaScript 执行结果: \(title)")
            }
        }
        
        // 获取页面内容
        example.getPageContent { content, error in
            if let content = content {
                print("📝 页面内容长度: \(content.count) 字符")
            }
        }
        
        // 截图
        example.captureScreenshot { image, error in
            if let image = image {
                print("📸 截图成功，尺寸: \(image.size)")
                // 这里可以保存图片或进行其他处理
            }
        }
    }
    
    // 4. 清理资源
    DispatchQueue.main.asyncAfter(deadline: .now() + 10.0) {
        example.destroy()
        print("🧹 WebView 实例已销毁")
    }
} 