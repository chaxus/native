export interface WebViewConfig {
  /** WebView 的宽度 */
  width: number;
  /** WebView 的高度 */
  height: number;
  /** 初始 URL */
  url?: string;
  /** 初始 HTML 内容 */
  html?: string;
  /** 是否显示在 UI 中 */
  visible?: boolean;
  /** 样式对象 */
  style?: any;
  /** 容器样式 */
  containerStyle?: any;
  /** 用户代理字符串 */
  userAgent?: string;
  /** 是否允许文件访问 */
  allowFileAccess?: boolean;
  /** 是否允许通用文件访问 */
  allowUniversalAccessFromFileURLs?: boolean;
  /** 自定义请求头 */
  headers?: Record<string, string>;
  /** 是否启用调试模式 */
  debug?: boolean;
  /** 是否启用 JavaScript */
  javaScriptEnabled?: boolean;
  /** 是否启用 DOM 存储 */
  domStorageEnabled?: boolean;
  /** 是否允许内联媒体播放 */
  allowsInlineMediaPlayback?: boolean;
  /** 媒体播放是否需要用户操作 */
  mediaPlaybackRequiresUserAction?: boolean;
  /** 是否启用缓存 */
  cacheEnabled?: boolean;
  /** 缓存模式 */
  cacheMode?: 'LOAD_DEFAULT' | 'LOAD_CACHE_ELSE_NETWORK' | 'LOAD_NO_CACHE' | 'LOAD_CACHE_ONLY';
}

export interface WebViewInstance {
  /** 显示 WebView */
  show(): void;
  /** 隐藏 WebView */
  hide(): void;
  /** 是否可见 */
  isVisible(): boolean;
  /** 是否已加载 */
  isLoaded(): boolean;
  /** 获取 React 组件 */
  getComponent(): React.ComponentType<any>;
  /** 加载 URL */
  loadUrl(url: string): Promise<void>;
  /** 加载 HTML 内容 */
  loadHTML(html: string, baseURL?: string): Promise<void>;
  /** 获取页面内容 */
  getPageContent(): Promise<string>;
  /** 获取页面标题 */
  getPageTitle(): Promise<string>;
  /** 获取当前 URL */
  getCurrentUrl(): Promise<string>;
  /** 返回上一页 */
  goBack(): Promise<void>;
  /** 前进到下一页 */
  goForward(): Promise<void>;
  /** 刷新页面 */
  reload(): Promise<void>;
  /** 销毁实例 */
  destroy(): Promise<void>;
}

export interface WebViewEvent {
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

export interface WebViewSDK {
  /** 创建 WebView 实例 */
  createInstance(config: WebViewConfig): Promise<WebViewInstance>;
  /** 检查平台支持 */
  isSupported(): boolean;
  /** 获取平台信息 */
  getPlatform(): 'android' | 'ios' | 'web' | 'harmonyos' | 'unknown';
  /** 获取版本信息 */
  getVersion(): string;
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