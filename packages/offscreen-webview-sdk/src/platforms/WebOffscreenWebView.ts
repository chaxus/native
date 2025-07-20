import { OffscreenWebViewConfig, OffscreenWebViewInstance } from '../types';

export class WebOffscreenWebView implements OffscreenWebViewInstance {
  private instanceId: string;
  private config: OffscreenWebViewConfig;
  private iframe: HTMLIFrameElement | null = null;
  private container: HTMLDivElement | null = null;
  private isDestroyed = false;

  constructor(instanceId: string, config: OffscreenWebViewConfig) {
    this.instanceId = instanceId;
    this.config = config;
    this.init();
  }

  /**
   * 初始化 WebView
   */
  private init(): void {
    // 创建隐藏的容器
    this.container = document.createElement('div');
    this.container.id = `offscreen-webview-${this.instanceId}`;
    this.container.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: ${this.config.width}px;
      height: ${this.config.height}px;
      overflow: hidden;
      visibility: hidden;
    `;

    // 创建 iframe
    this.iframe = document.createElement('iframe');
    this.iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      margin: 0;
      padding: 0;
    `;

    // 设置 iframe 属性
    if (this.config.userAgent) {
      this.iframe.setAttribute('data-user-agent', this.config.userAgent);
    }

    this.container.appendChild(this.iframe);
    document.body.appendChild(this.container);

    // 注入初始 JavaScript
    if (this.config.injectedJavaScript) {
      this.injectScript(this.config.injectedJavaScript);
    }
  }

  /**
   * 注入 JavaScript 脚本
   */
  private injectScript(script: string): void {
    if (!this.iframe || !this.iframe.contentWindow) return;

    try {
      const scriptElement = this.iframe.contentDocument?.createElement('script');
      if (scriptElement) {
        scriptElement.textContent = script;
        this.iframe.contentDocument?.head?.appendChild(scriptElement);
      }
    } catch (error) {
      console.warn('Failed to inject script:', error);
    }
  }

  /**
   * 等待 iframe 加载完成
   */
  private waitForIframeLoad(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.iframe) {
        resolve();
        return;
      }

      if (this.iframe.contentDocument?.readyState === 'complete') {
        resolve();
        return;
      }

      this.iframe.onload = () => resolve();
    });
  }

  /**
   * 加载 URL
   */
  async loadUrl(url: string): Promise<void> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    if (!this.iframe) throw new Error('Iframe not initialized');

    try {
      this.iframe.src = url;
      await this.waitForIframeLoad();
    } catch (error) {
      throw new Error(`Failed to load URL: ${error}`);
    }
  }

  /**
   * 加载 HTML 内容
   */
  async loadHTML(html: string, baseURL?: string): Promise<void> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    if (!this.iframe) throw new Error('Iframe not initialized');

    try {
      this.iframe.src = 'about:blank';
      await this.waitForIframeLoad();

      if (this.iframe.contentDocument) {
        this.iframe.contentDocument.open();
        this.iframe.contentDocument.write(html);
        this.iframe.contentDocument.close();
      }
    } catch (error) {
      throw new Error(`Failed to load HTML: ${error}`);
    }
  }

  /**
   * 执行 JavaScript 代码
   */
  async executeJavaScript(script: string): Promise<any> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    if (!this.iframe || !this.iframe.contentWindow) {
      throw new Error('Iframe not available');
    }

    try {
      return await this.iframe.contentWindow.eval(script);
    } catch (error) {
      throw new Error(`Failed to execute JavaScript: ${error}`);
    }
  }

  /**
   * 获取页面截图
   */
  async captureScreenshot(): Promise<string> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    if (!this.iframe) throw new Error('Iframe not initialized');

    try {
      // 使用 html2canvas 或其他截图库
      // 这里使用简单的 canvas 方法
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Failed to get canvas context');

      canvas.width = this.config.width;
      canvas.height = this.config.height;

      // 创建图片元素
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = reject;
        
        // 将 iframe 内容转换为图片
        const iframeContent = this.iframe.contentDocument;
        if (iframeContent) {
          const html = iframeContent.documentElement.outerHTML;
          const blob = new Blob([html], { type: 'text/html' });
          img.src = URL.createObjectURL(blob);
        } else {
          reject(new Error('Iframe content not available'));
        }
      });
    } catch (error) {
      throw new Error(`Failed to capture screenshot: ${error}`);
    }
  }

  /**
   * 获取页面内容
   */
  async getPageContent(): Promise<string> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    if (!this.iframe || !this.iframe.contentDocument) {
      throw new Error('Iframe content not available');
    }

    try {
      return this.iframe.contentDocument.documentElement.outerHTML;
    } catch (error) {
      throw new Error(`Failed to get page content: ${error}`);
    }
  }

  /**
   * 获取页面标题
   */
  async getPageTitle(): Promise<string> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    if (!this.iframe || !this.iframe.contentDocument) {
      throw new Error('Iframe content not available');
    }

    try {
      return this.iframe.contentDocument.title || '';
    } catch (error) {
      throw new Error(`Failed to get page title: ${error}`);
    }
  }

  /**
   * 获取当前 URL
   */
  async getCurrentUrl(): Promise<string> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    if (!this.iframe) throw new Error('Iframe not initialized');

    try {
      return this.iframe.src || '';
    } catch (error) {
      throw new Error(`Failed to get current URL: ${error}`);
    }
  }

  /**
   * 返回上一页
   */
  async goBack(): Promise<boolean> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    if (!this.iframe || !this.iframe.contentWindow) {
      throw new Error('Iframe not available');
    }

    try {
      return this.iframe.contentWindow.history.back();
    } catch (error) {
      throw new Error(`Failed to go back: ${error}`);
    }
  }

  /**
   * 前进到下一页
   */
  async goForward(): Promise<boolean> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    if (!this.iframe || !this.iframe.contentWindow) {
      throw new Error('Iframe not available');
    }

    try {
      return this.iframe.contentWindow.history.forward();
    } catch (error) {
      throw new Error(`Failed to go forward: ${error}`);
    }
  }

  /**
   * 刷新页面
   */
  async reload(): Promise<void> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    if (!this.iframe) throw new Error('Iframe not initialized');

    try {
      this.iframe.src = this.iframe.src;
      await this.waitForIframeLoad();
    } catch (error) {
      throw new Error(`Failed to reload: ${error}`);
    }
  }

  /**
   * 停止加载
   */
  async stopLoading(): Promise<void> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    if (!this.iframe) throw new Error('Iframe not initialized');

    try {
      this.iframe.src = 'about:blank';
    } catch (error) {
      throw new Error(`Failed to stop loading: ${error}`);
    }
  }

  /**
   * 销毁实例
   */
  async destroy(): Promise<void> {
    if (this.isDestroyed) return;

    try {
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
      this.iframe = null;
      this.container = null;
      this.isDestroyed = true;
    } catch (error) {
      throw new Error(`Failed to destroy instance: ${error}`);
    }
  }
} 