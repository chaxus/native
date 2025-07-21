import type { WebViewConfig, WebViewInstance } from '../types';

export class WebOffscreenWebView implements WebViewInstance {
  private instanceId: string;
  private config: WebViewConfig;
  private isDestroyed = false;
  private iframe: HTMLIFrameElement | null = null;

  constructor(instanceId: string, config: WebViewConfig) {
    this.instanceId = instanceId;
    this.config = config;
    this.initIframe();
  }

  private initIframe() {
    if (typeof window === 'undefined') return;

    this.iframe = document.createElement('iframe');
    this.iframe.style.width = `${this.config.width}px`;
    this.iframe.style.height = `${this.config.height}px`;
    this.iframe.style.border = 'none';
    this.iframe.style.position = 'absolute';
    this.iframe.style.top = '0';
    this.iframe.style.left = '0';
    this.iframe.style.zIndex = '1000';
    this.iframe.style.display = this.config.visible ? 'block' : 'none';

    if (this.config.url) {
      this.iframe.src = this.config.url;
    }

    document.body.appendChild(this.iframe);
  }

  show(): void {
    if (this.isDestroyed || !this.iframe) return;
    this.iframe.style.display = 'block';
  }

  hide(): void {
    if (this.isDestroyed || !this.iframe) return;
    this.iframe.style.display = 'none';
  }

  isVisible(): boolean {
    return this.iframe?.style.display !== 'none';
  }

  isLoaded(): boolean {
    return this.iframe?.contentDocument?.readyState === 'complete';
  }

  getComponent(): React.ComponentType<any> {
    // Web 平台不需要返回 React 组件
    return () => null;
  }

  async loadUrl(url: string): Promise<void> {
    if (this.isDestroyed || !this.iframe) throw new Error('Instance is destroyed');
    this.iframe.src = url;
  }

  async loadHTML(html: string, baseURL?: string): Promise<void> {
    if (this.isDestroyed || !this.iframe) throw new Error('Instance is destroyed');
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    this.iframe.src = url;
  }

  async getPageContent(): Promise<string> {
    if (this.isDestroyed || !this.iframe) throw new Error('Instance is destroyed');
    
    try {
      const content = this.iframe.contentDocument?.documentElement?.outerHTML || '';
      return content;
    } catch (error) {
      throw new Error(`Failed to get page content: ${error}`);
    }
  }

  async getPageTitle(): Promise<string> {
    if (this.isDestroyed || !this.iframe) throw new Error('Instance is destroyed');
    
    try {
      const title = this.iframe.contentDocument?.title || '';
      return title;
    } catch (error) {
      throw new Error(`Failed to get page title: ${error}`);
    }
  }

  async getCurrentUrl(): Promise<string> {
    if (this.isDestroyed || !this.iframe) throw new Error('Instance is destroyed');
    return this.iframe.src;
  }

  async executeJavaScript(script: string): Promise<any> {
    if (this.isDestroyed || !this.iframe) throw new Error('Instance is destroyed');
    
    try {
      const result = (this.iframe.contentWindow as any)?.eval(script);
      return result;
    } catch (error) {
      throw new Error(`Failed to execute JavaScript: ${error}`);
    }
  }

  async goBack(): Promise<void> {
    if (this.isDestroyed || !this.iframe) throw new Error('Instance is destroyed');
    
    try {
      this.iframe.contentWindow?.history.back();
    } catch (error) {
      throw new Error(`Failed to go back: ${error}`);
    }
  }

  async goForward(): Promise<void> {
    if (this.isDestroyed || !this.iframe) throw new Error('Instance is destroyed');
    
    try {
      this.iframe.contentWindow?.history.forward();
    } catch (error) {
      throw new Error(`Failed to go forward: ${error}`);
    }
  }

  async reload(): Promise<void> {
    if (this.isDestroyed || !this.iframe) throw new Error('Instance is destroyed');
    
    try {
      this.iframe.contentWindow?.location.reload();
    } catch (error) {
      throw new Error(`Failed to reload: ${error}`);
    }
  }

  async destroy(): Promise<void> {
    if (this.isDestroyed) return;

    try {
      if (this.iframe && this.iframe.parentNode) {
        this.iframe.parentNode.removeChild(this.iframe);
      }
      this.iframe = null;
      this.isDestroyed = true;
    } catch (error) {
      throw new Error(`Failed to destroy instance: ${error}`);
    }
  }
}