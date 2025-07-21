import web_webview from '@ohos.web.webview';
import { BusinessError } from '@ohos.base';

/**
 * 鸿蒙系统 WebView 模块
 * 提供离屏 WebView 功能
 */
export class OffscreenWebViewModule {
  private webView: web_webview.WebviewController | null = null;
  private isDestroyed = false;

  /**
   * 创建 WebView 实例
   */
  async createWebView(config: {
    width: number;
    height: number;
    url?: string;
    html?: string;
    userAgent?: string;
    javaScriptEnabled?: boolean;
    domStorageEnabled?: boolean;
    cacheEnabled?: boolean;
  }): Promise<void> {
    try {
      // 创建 WebView 控制器
      this.webView = web_webview.createWebviewController();
      
      // 设置 WebView 配置
      if (config.userAgent) {
        this.webView.setUserAgent(config.userAgent);
      }
      
      if (config.javaScriptEnabled !== undefined) {
        this.webView.setJavaScriptEnabled(config.javaScriptEnabled);
      }
      
      if (config.domStorageEnabled !== undefined) {
        this.webView.setDomStorageEnabled(config.domStorageEnabled);
      }
      
      if (config.cacheEnabled !== undefined) {
        this.webView.setCacheEnabled(config.cacheEnabled);
      }

      // 加载内容
      if (config.html) {
        await this.webView.loadData(config.html, 'text/html', 'UTF-8');
      } else if (config.url) {
        await this.webView.loadUrl(config.url);
      }

      console.log('HarmonyOS WebView created successfully');
    } catch (error) {
      const err = error as BusinessError;
      console.error('Failed to create HarmonyOS WebView:', err.message);
      throw new Error(`Failed to create WebView: ${err.message}`);
    }
  }

  /**
   * 加载 URL
   */
  async loadUrl(url: string): Promise<void> {
    if (this.isDestroyed || !this.webView) {
      throw new Error('WebView is not available');
    }

    try {
      await this.webView.loadUrl(url);
      console.log('HarmonyOS WebView loaded URL:', url);
    } catch (error) {
      const err = error as BusinessError;
      console.error('Failed to load URL:', err.message);
      throw new Error(`Failed to load URL: ${err.message}`);
    }
  }

  /**
   * 加载 HTML 内容
   */
  async loadHTML(html: string, baseURL?: string): Promise<void> {
    if (this.isDestroyed || !this.webView) {
      throw new Error('WebView is not available');
    }

    try {
      await this.webView.loadData(html, 'text/html', 'UTF-8');
      console.log('HarmonyOS WebView loaded HTML content');
    } catch (error) {
      const err = error as BusinessError;
      console.error('Failed to load HTML:', err.message);
      throw new Error(`Failed to load HTML: ${err.message}`);
    }
  }

  /**
   * 执行 JavaScript
   */
  async executeJavaScript(script: string): Promise<string> {
    if (this.isDestroyed || !this.webView) {
      throw new Error('WebView is not available');
    }

    try {
      const result = await this.webView.runJavaScript(script);
      console.log('HarmonyOS WebView executed JavaScript:', script);
      return result || '';
    } catch (error) {
      const err = error as BusinessError;
      console.error('Failed to execute JavaScript:', err.message);
      throw new Error(`Failed to execute JavaScript: ${err.message}`);
    }
  }

  /**
   * 获取页面内容
   */
  async getPageContent(): Promise<string> {
    return await this.executeJavaScript('document.documentElement.outerHTML');
  }

  /**
   * 获取页面标题
   */
  async getPageTitle(): Promise<string> {
    return await this.executeJavaScript('document.title');
  }

  /**
   * 获取当前 URL
   */
  async getCurrentUrl(): Promise<string> {
    return await this.executeJavaScript('window.location.href');
  }

  /**
   * 返回上一页
   */
  async goBack(): Promise<void> {
    if (this.isDestroyed || !this.webView) {
      throw new Error('WebView is not available');
    }

    try {
      await this.webView.backward();
      console.log('HarmonyOS WebView went back');
    } catch (error) {
      const err = error as BusinessError;
      console.error('Failed to go back:', err.message);
      throw new Error(`Failed to go back: ${err.message}`);
    }
  }

  /**
   * 前进到下一页
   */
  async goForward(): Promise<void> {
    if (this.isDestroyed || !this.webView) {
      throw new Error('WebView is not available');
    }

    try {
      await this.webView.forward();
      console.log('HarmonyOS WebView went forward');
    } catch (error) {
      const err = error as BusinessError;
      console.error('Failed to go forward:', err.message);
      throw new Error(`Failed to go forward: ${err.message}`);
    }
  }

  /**
   * 刷新页面
   */
  async reload(): Promise<void> {
    if (this.isDestroyed || !this.webView) {
      throw new Error('WebView is not available');
    }

    try {
      await this.webView.refresh();
      console.log('HarmonyOS WebView reloaded');
    } catch (error) {
      const err = error as BusinessError;
      console.error('Failed to reload:', err.message);
      throw new Error(`Failed to reload: ${err.message}`);
    }
  }

  /**
   * 销毁 WebView
   */
  async destroy(): Promise<void> {
    if (this.isDestroyed) {
      return;
    }

    try {
      if (this.webView) {
        this.webView.destroy();
        this.webView = null;
      }
      this.isDestroyed = true;
      console.log('HarmonyOS WebView destroyed');
    } catch (error) {
      const err = error as BusinessError;
      console.error('Failed to destroy WebView:', err.message);
      throw new Error(`Failed to destroy WebView: ${err.message}`);
    }
  }

  /**
   * 检查是否已销毁
   */
  isDestroyed(): boolean {
    return this.isDestroyed;
  }
} 