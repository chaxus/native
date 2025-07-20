export interface OffscreenWebViewConfig {
  /** WebView 的宽度 */
  width: number;
  /** WebView 的高度 */
  height: number;
  /** 初始 URL */
  url?: string;
  /** 初始 HTML 内容 */
  html?: string;
  /** 用户代理字符串 */
  userAgent?: string;
  /** 是否启用 JavaScript */
  javaScriptEnabled?: boolean;
  /** 是否允许文件访问 */
  allowFileAccess?: boolean;
  /** 是否允许通用文件访问 */
  allowUniversalAccessFromFileURLs?: boolean;
  /** 自定义请求头 */
  headers?: Record<string, string>;
  /** 注入的 JavaScript 代码 */
  injectedJavaScript?: string;
  /** 是否启用调试模式 */
  debug?: boolean;
}

export interface OffscreenWebViewInstance {
  /** 加载 URL */
  loadUrl(url: string): Promise<void>;
  /** 加载 HTML 内容 */
  loadHTML(html: string, baseURL?: string): Promise<void>;
  /** 执行 JavaScript 代码 */
  executeJavaScript(script: string): Promise<any>;
  /** 获取页面截图 */
  captureScreenshot(): Promise<string>;
  /** 获取页面内容 */
  getPageContent(): Promise<string>;
  /** 获取页面标题 */
  getPageTitle(): Promise<string>;
  /** 获取当前 URL */
  getCurrentUrl(): Promise<string>;
  /** 返回上一页 */
  goBack(): Promise<boolean>;
  /** 前进到下一页 */
  goForward(): Promise<boolean>;
  /** 刷新页面 */
  reload(): Promise<void>;
  /** 停止加载 */
  stopLoading(): Promise<void>;
  /** 销毁实例 */
  destroy(): Promise<void>;
}

export interface OffscreenWebViewEvent {
  /** 页面开始加载 */
  onLoadStart?: (event: { url: string }) => void;
  /** 页面加载完成 */
  onLoadEnd?: (event: { url: string }) => void;
  /** 页面加载错误 */
  onError?: (event: { url: string; error: string }) => void;
  /** 页面标题变化 */
  onTitleChange?: (event: { title: string }) => void;
  /** 页面进度变化 */
  onProgress?: (event: { progress: number }) => void;
  /** JavaScript 消息 */
  onMessage?: (event: { data: any }) => void;
}

export interface OffscreenWebViewSDK {
  /** 创建离屏 WebView 实例 */
  createInstance(config: OffscreenWebViewConfig): Promise<OffscreenWebViewInstance>;
  /** 检查平台支持 */
  isSupported(): boolean;
  /** 获取平台信息 */
  getPlatform(): 'android' | 'ios' | 'web' | 'unknown';
  /** 获取版本信息 */
  getVersion(): string;
}

export interface ScreenshotOptions {
  /** 截图格式 */
  format?: 'png' | 'jpeg' | 'webp';
  /** 图片质量 (0-1) */
  quality?: number;
  /** 是否包含滚动内容 */
  fullPage?: boolean;
  /** 自定义宽度 */
  width?: number;
  /** 自定义高度 */
  height?: number;
}

export interface NavigationOptions {
  /** 超时时间 (毫秒) */
  timeout?: number;
  /** 是否等待页面完全加载 */
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
}

export interface JavaScriptExecutionOptions {
  /** 执行超时时间 (毫秒) */
  timeout?: number;
  /** 是否在页面加载完成后执行 */
  waitForLoad?: boolean;
} 