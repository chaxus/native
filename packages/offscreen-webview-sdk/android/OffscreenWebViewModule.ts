import { NativeEventEmitter, NativeModules } from 'react-native';
import { OffscreenWebViewConfig, OffscreenWebViewInstance } from '../types';

interface AndroidOffscreenWebViewModule {
  createInstance(instanceId: string, config: any): Promise<void>;
  loadUrl(instanceId: string, url: string): Promise<void>;
  loadHTML(instanceId: string, html: string, baseURL?: string): Promise<void>;
  executeJavaScript(instanceId: string, script: string): Promise<any>;
  captureScreenshot(instanceId: string, options?: any): Promise<string>;
  getPageContent(instanceId: string): Promise<string>;
  getPageTitle(instanceId: string): Promise<string>;
  getCurrentUrl(instanceId: string): Promise<string>;
  goBack(instanceId: string): Promise<boolean>;
  goForward(instanceId: string): Promise<boolean>;
  reload(instanceId: string): Promise<void>;
  stopLoading(instanceId: string): Promise<void>;
  destroy(instanceId: string): Promise<void>;
}

export class OffscreenWebViewModule implements OffscreenWebViewInstance {
  private instanceId: string;
  private config: OffscreenWebViewConfig;
  private eventEmitter: NativeEventEmitter;
  private eventListeners: Map<string, any> = new Map();

  constructor(instanceId: string, config: OffscreenWebViewConfig) {
    this.instanceId = instanceId;
    this.config = config;
    this.eventEmitter = new NativeEventEmitter(NativeModules.OffscreenWebViewModule);
    this.setupEventListeners();
  }

  /**
   * 设置事件监听器
   */
  private setupEventListeners(): void {
    const events = [
      'onLoadStart',
      'onLoadEnd', 
      'onError',
      'onTitleChange',
      'onProgress',
      'onMessage'
    ];

    events.forEach(eventName => {
      const listener = this.eventEmitter.addListener(
        `${this.instanceId}:${eventName}`,
        (data) => {
          if (this.config.debug) {
            console.log(`[OffscreenWebView] ${eventName}:`, data);
          }
        }
      );
      this.eventListeners.set(eventName, listener);
    });
  }

  /**
   * 移除事件监听器
   */
  private removeEventListeners(): void {
    this.eventListeners.forEach(listener => listener.remove());
    this.eventListeners.clear();
  }

  /**
   * 加载 URL
   */
  async loadUrl(url: string): Promise<void> {
    try {
      await NativeModules.OffscreenWebViewModule.loadUrl(this.instanceId, url);
    } catch (error) {
      throw new Error(`Failed to load URL: ${error}`);
    }
  }

  /**
   * 加载 HTML 内容
   */
  async loadHTML(html: string, baseURL?: string): Promise<void> {
    try {
      await NativeModules.OffscreenWebViewModule.loadHTML(this.instanceId, html, baseURL);
    } catch (error) {
      throw new Error(`Failed to load HTML: ${error}`);
    }
  }

  /**
   * 执行 JavaScript 代码
   */
  async executeJavaScript(script: string): Promise<any> {
    try {
      return await NativeModules.OffscreenWebViewModule.executeJavaScript(this.instanceId, script);
    } catch (error) {
      throw new Error(`Failed to execute JavaScript: ${error}`);
    }
  }

  /**
   * 获取页面截图
   */
  async captureScreenshot(): Promise<string> {
    try {
      return await NativeModules.OffscreenWebViewModule.captureScreenshot(this.instanceId);
    } catch (error) {
      throw new Error(`Failed to capture screenshot: ${error}`);
    }
  }

  /**
   * 获取页面内容
   */
  async getPageContent(): Promise<string> {
    try {
      return await NativeModules.OffscreenWebViewModule.getPageContent(this.instanceId);
    } catch (error) {
      throw new Error(`Failed to get page content: ${error}`);
    }
  }

  /**
   * 获取页面标题
   */
  async getPageTitle(): Promise<string> {
    try {
      return await NativeModules.OffscreenWebViewModule.getPageTitle(this.instanceId);
    } catch (error) {
      throw new Error(`Failed to get page title: ${error}`);
    }
  }

  /**
   * 获取当前 URL
   */
  async getCurrentUrl(): Promise<string> {
    try {
      return await NativeModules.OffscreenWebViewModule.getCurrentUrl(this.instanceId);
    } catch (error) {
      throw new Error(`Failed to get current URL: ${error}`);
    }
  }

  /**
   * 返回上一页
   */
  async goBack(): Promise<boolean> {
    try {
      return await NativeModules.OffscreenWebViewModule.goBack(this.instanceId);
    } catch (error) {
      throw new Error(`Failed to go back: ${error}`);
    }
  }

  /**
   * 前进到下一页
   */
  async goForward(): Promise<boolean> {
    try {
      return await NativeModules.OffscreenWebViewModule.goForward(this.instanceId);
    } catch (error) {
      throw new Error(`Failed to go forward: ${error}`);
    }
  }

  /**
   * 刷新页面
   */
  async reload(): Promise<void> {
    try {
      await NativeModules.OffscreenWebViewModule.reload(this.instanceId);
    } catch (error) {
      throw new Error(`Failed to reload: ${error}`);
    }
  }

  /**
   * 停止加载
   */
  async stopLoading(): Promise<void> {
    try {
      await NativeModules.OffscreenWebViewModule.stopLoading(this.instanceId);
    } catch (error) {
      throw new Error(`Failed to stop loading: ${error}`);
    }
  }

  /**
   * 销毁实例
   */
  async destroy(): Promise<void> {
    try {
      this.removeEventListeners();
      await NativeModules.OffscreenWebViewModule.destroy(this.instanceId);
    } catch (error) {
      throw new Error(`Failed to destroy instance: ${error}`);
    }
  }
} 