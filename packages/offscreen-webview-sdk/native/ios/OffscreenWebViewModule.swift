import Foundation
import WebKit
import UIKit

@objc(OffscreenWebViewModule)
class OffscreenWebViewModule: NSObject {
  
  private var webViews: [String: WKWebView] = [:]
  private var eventEmitter: RCTEventEmitter?
  
  override init() {
    super.init()
  }
  
  @objc
  func createInstance(_ instanceId: String, config: [String: Any], resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      do {
        let webView = try self.createWebView(instanceId: instanceId, config: config)
        self.webViews[instanceId] = webView
        resolver(nil)
      } catch {
        rejecter("CREATE_ERROR", "Failed to create WebView instance", error)
      }
    }
  }
  
  @objc
  func loadUrl(_ instanceId: String, url: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let webView = webViews[instanceId] else {
      rejecter("NOT_FOUND", "WebView instance not found", nil)
      return
    }
    
    DispatchQueue.main.async {
      guard let url = URL(string: url) else {
        rejecter("INVALID_URL", "Invalid URL", nil)
        return
      }
      
      let request = URLRequest(url: url)
      webView.load(request)
      resolver(nil)
    }
  }
  
  @objc
  func loadHTML(_ instanceId: String, html: String, baseURL: String?, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let webView = webViews[instanceId] else {
      rejecter("NOT_FOUND", "WebView instance not found", nil)
      return
    }
    
    DispatchQueue.main.async {
      let baseURLValue = baseURL != nil ? URL(string: baseURL!) : nil
      webView.loadHTMLString(html, baseURL: baseURLValue)
      resolver(nil)
    }
  }
  
  @objc
  func executeJavaScript(_ instanceId: String, script: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let webView = webViews[instanceId] else {
      rejecter("NOT_FOUND", "WebView instance not found", nil)
      return
    }
    
    DispatchQueue.main.async {
      webView.evaluateJavaScript(script) { result, error in
        if let error = error {
          rejecter("JS_ERROR", "JavaScript execution failed", error)
        } else {
          resolver(result)
        }
      }
    }
  }
  
  @objc
  func captureScreenshot(_ instanceId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let webView = webViews[instanceId] else {
      rejecter("NOT_FOUND", "WebView instance not found", nil)
      return
    }
    
    DispatchQueue.main.async {
      let renderer = UIGraphicsImageRenderer(bounds: webView.bounds)
      let image = renderer.image { context in
        webView.layer.render(in: context.cgContext)
      }
      
      guard let imageData = image.pngData() else {
        rejecter("SCREENSHOT_ERROR", "Failed to create screenshot", nil)
        return
      }
      
      let base64String = imageData.base64EncodedString()
      resolver(base64String)
    }
  }
  
  @objc
  func getPageContent(_ instanceId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let webView = webViews[instanceId] else {
      rejecter("NOT_FOUND", "WebView instance not found", nil)
      return
    }
    
    DispatchQueue.main.async {
      webView.evaluateJavaScript("document.documentElement.outerHTML") { result, error in
        if let error = error {
          rejecter("CONTENT_ERROR", "Failed to get page content", error)
        } else {
          resolver(result as? String ?? "")
        }
      }
    }
  }
  
  @objc
  func getPageTitle(_ instanceId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let webView = webViews[instanceId] else {
      rejecter("NOT_FOUND", "WebView instance not found", nil)
      return
    }
    
    DispatchQueue.main.async {
      webView.evaluateJavaScript("document.title") { result, error in
        if let error = error {
          rejecter("TITLE_ERROR", "Failed to get page title", error)
        } else {
          resolver(result as? String ?? "")
        }
      }
    }
  }
  
  @objc
  func getCurrentUrl(_ instanceId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let webView = webViews[instanceId] else {
      rejecter("NOT_FOUND", "WebView instance not found", nil)
      return
    }
    
    DispatchQueue.main.async {
      resolver(webView.url?.absoluteString ?? "")
    }
  }
  
  @objc
  func goBack(_ instanceId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let webView = webViews[instanceId] else {
      rejecter("NOT_FOUND", "WebView instance not found", nil)
      return
    }
    
    DispatchQueue.main.async {
      let canGoBack = webView.canGoBack
      if canGoBack {
        webView.goBack()
      }
      resolver(canGoBack)
    }
  }
  
  @objc
  func goForward(_ instanceId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let webView = webViews[instanceId] else {
      rejecter("NOT_FOUND", "WebView instance not found", nil)
      return
    }
    
    DispatchQueue.main.async {
      let canGoForward = webView.canGoForward
      if canGoForward {
        webView.goForward()
      }
      resolver(canGoForward)
    }
  }
  
  @objc
  func reload(_ instanceId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let webView = webViews[instanceId] else {
      rejecter("NOT_FOUND", "WebView instance not found", nil)
      return
    }
    
    DispatchQueue.main.async {
      webView.reload()
      resolver(nil)
    }
  }
  
  @objc
  func stopLoading(_ instanceId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    guard let webView = webViews[instanceId] else {
      rejecter("NOT_FOUND", "WebView instance not found", nil)
      return
    }
    
    DispatchQueue.main.async {
      webView.stopLoading()
      resolver(nil)
    }
  }
  
  @objc
  func destroy(_ instanceId: String, resolver: @escaping RCTPromiseResolveBlock, rejecter: @escaping RCTPromiseRejectBlock) {
    DispatchQueue.main.async {
      if let webView = self.webViews[instanceId] {
        webView.stopLoading()
        webView.loadHTMLString("", baseURL: nil)
        self.webViews.removeValue(forKey: instanceId)
      }
      resolver(nil)
    }
  }
  
  // MARK: - Private Methods
  
  private func createWebView(instanceId: String, config: [String: Any]) throws -> WKWebView {
    let configuration = WKWebViewConfiguration()
    
    // 配置 JavaScript 支持
    if let javaScriptEnabled = config["javaScriptEnabled"] as? Bool {
      configuration.preferences.javaScriptEnabled = javaScriptEnabled
    }
    
    // 配置用户代理
    if let userAgent = config["userAgent"] as? String {
      configuration.applicationNameForUserAgent = userAgent
    }
    
    // 配置允许文件访问
    if let allowFileAccess = config["allowFileAccess"] as? Bool {
      configuration.preferences.javaScriptCanOpenWindowsAutomatically = allowFileAccess
    }
    
    // 创建 WebView
    let webView = WKWebView(frame: .zero, configuration: configuration)
    webView.navigationDelegate = self
    webView.uiDelegate = self
    
    // 设置尺寸
    if let width = config["width"] as? CGFloat, let height = config["height"] as? CGFloat {
      webView.frame = CGRect(x: 0, y: 0, width: width, height: height)
    }
    
    // 注入初始 JavaScript
    if let injectedJavaScript = config["injectedJavaScript"] as? String {
      webView.evaluateJavaScript(injectedJavaScript)
    }
    
    return webView
  }
}

// MARK: - WKNavigationDelegate
extension OffscreenWebViewModule: WKNavigationDelegate {
  func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!) {
    // 发送加载开始事件
    sendEvent(webView: webView, eventName: "onLoadStart", data: ["url": webView.url?.absoluteString ?? ""])
  }
  
  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    // 发送加载完成事件
    sendEvent(webView: webView, eventName: "onLoadEnd", data: ["url": webView.url?.absoluteString ?? ""])
  }
  
  func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
    // 发送错误事件
    sendEvent(webView: webView, eventName: "onError", data: [
      "url": webView.url?.absoluteString ?? "",
      "error": error.localizedDescription
    ])
  }
  
  func webView(_ webView: WKWebView, didReceiveServerRedirectForProvisionalNavigation navigation: WKNavigation!) {
    // 发送标题变化事件
    webView.evaluateJavaScript("document.title") { result, error in
      if let title = result as? String {
        self.sendEvent(webView: webView, eventName: "onTitleChange", data: ["title": title])
      }
    }
  }
}

// MARK: - WKUIDelegate
extension OffscreenWebViewModule: WKUIDelegate {
  // 处理 JavaScript 弹窗等
}

// MARK: - Event Handling
extension OffscreenWebViewModule {
  private func sendEvent(webView: WKWebView, eventName: String, data: [String: Any]) {
    // 找到对应的 instanceId
    let instanceId = webViews.first { $0.value == webView }?.key ?? ""
    let eventData: [String: Any] = [
      "instanceId": instanceId,
      "data": data
    ]
    
    // 这里需要实现事件发送逻辑
    // 可以通过 RCTEventEmitter 发送事件到 React Native
  }
}

// MARK: - React Native Module Export
@objc
extension OffscreenWebViewModule {
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
} 