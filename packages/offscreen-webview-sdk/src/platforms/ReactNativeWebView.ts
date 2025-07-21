import React, { createContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import type { WebViewConfig, WebViewInstance } from '../types';

interface WebViewContextType {
  showWebView: () => void;
  hideWebView: () => void;
  isVisible: boolean;
  isLoaded: boolean;
}

const WebViewContext = createContext<WebViewContextType | undefined>(undefined);

export class ReactNativeWebView implements WebViewInstance {
  private instanceId: string;
  private config: WebViewConfig;
  private isDestroyed = false;
  private contextValue: WebViewContextType | null = null;

  constructor(instanceId: string, config: WebViewConfig) {
    this.instanceId = instanceId;
    this.config = config;
  }

  /**
   * 创建 React 组件
   */
  getComponent(): React.ComponentType<any> {
    const WebViewProvider = ({ children }: { children: React.ReactNode }) => {
      const [isVisible, setIsVisible] = useState(this.config.visible ?? false);
      const [isLoaded, setIsLoaded] = useState(false);

      const showWebView = () => {
        setIsVisible(true);
      };

      const hideWebView = () => {
        setIsVisible(false);
      };

      this.contextValue = {
        showWebView,
        hideWebView,
        isVisible,
        isLoaded,
      };

      const webViewProps = {
        source: { uri: this.config.url || '' },
        style: styles.webView,
        startInLoadingState: true,
        javaScriptEnabled: this.config.javaScriptEnabled ?? true,
        domStorageEnabled: this.config.domStorageEnabled ?? true,
        allowsInlineMediaPlayback: this.config.allowsInlineMediaPlayback ?? true,
        mediaPlaybackRequiresUserAction: this.config.mediaPlaybackRequiresUserAction ?? false,
        cacheEnabled: this.config.cacheEnabled ?? true,
        cacheMode: this.config.cacheMode || 'LOAD_DEFAULT',
        onLoadEnd: () => {
          console.log('WebView loaded:', this.config.url);
          setIsLoaded(true);
        },
        onError: (syntheticEvent: any) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        },
      };

      return React.createElement(
        WebViewContext.Provider,
        { value: this.contextValue },
        children,
        React.createElement(
          View,
          { style: [styles.webViewContainer, !isVisible && styles.hidden] },
          React.createElement(WebView, webViewProps)
        )
      );
    };

    return WebViewProvider;
  }

  /**
   * 显示 WebView
   */
  show(): void {
    if (this.isDestroyed) return;
    this.contextValue?.showWebView();
  }

  /**
   * 隐藏 WebView
   */
  hide(): void {
    if (this.isDestroyed) return;
    this.contextValue?.hideWebView();
  }

  /**
   * 是否可见
   */
  isVisible(): boolean {
    return this.contextValue?.isVisible ?? false;
  }

  /**
   * 是否已加载
   */
  isLoaded(): boolean {
    return this.contextValue?.isLoaded ?? false;
  }

  /**
   * 加载 URL
   */
  async loadUrl(url: string): Promise<void> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    
    try {
      // 这里需要更新 WebView 的 source
      console.log('Loading URL:', url);
    } catch (error) {
      throw new Error(`Failed to load URL: ${error}`);
    }
  }

  /**
   * 加载 HTML 内容
   */
  async loadHTML(html: string, baseURL?: string): Promise<void> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    
    try {
      console.log('Loading HTML:', html.substring(0, 100));
    } catch (error) {
      throw new Error(`Failed to load HTML: ${error}`);
    }
  }

  /**
   * 获取页面内容
   */
  async getPageContent(): Promise<string> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    
    try {
      return await this.executeJavaScript('document.documentElement.outerHTML');
    } catch (error) {
      throw new Error(`Failed to get page content: ${error}`);
    }
  }

  /**
   * 获取页面标题
   */
  async getPageTitle(): Promise<string> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    
    try {
      return await this.executeJavaScript('document.title');
    } catch (error) {
      throw new Error(`Failed to get page title: ${error}`);
    }
  }

  /**
   * 获取当前 URL
   */
  async getCurrentUrl(): Promise<string> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    
    try {
      return await this.executeJavaScript('window.location.href');
    } catch (error) {
      throw new Error(`Failed to get current URL: ${error}`);
    }
  }

  /**
   * 执行 JavaScript
   */
  async executeJavaScript(script: string): Promise<any> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    
    try {
      // 这里需要通过 WebView 的 ref 来执行 JavaScript
      console.log('Executing JavaScript:', script);
      return '';
    } catch (error) {
      throw new Error(`Failed to execute JavaScript: ${error}`);
    }
  }

  /**
   * 返回上一页
   */
  async goBack(): Promise<void> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    
    try {
      await this.executeJavaScript('window.history.back()');
    } catch (error) {
      throw new Error(`Failed to go back: ${error}`);
    }
  }

  /**
   * 前进到下一页
   */
  async goForward(): Promise<void> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    
    try {
      await this.executeJavaScript('window.history.forward()');
    } catch (error) {
      throw new Error(`Failed to go forward: ${error}`);
    }
  }

  /**
   * 刷新页面
   */
  async reload(): Promise<void> {
    if (this.isDestroyed) throw new Error('Instance is destroyed');
    
    try {
      await this.executeJavaScript('window.location.reload()');
    } catch (error) {
      throw new Error(`Failed to reload: ${error}`);
    }
  }

  /**
   * 销毁实例
   */
  async destroy(): Promise<void> {
    if (this.isDestroyed) return;

    try {
      this.isDestroyed = true;
      this.contextValue = null;
    } catch (error) {
      throw new Error(`Failed to destroy instance: ${error}`);
    }
  }
}

const styles = StyleSheet.create({
  webViewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 100, // 留出底部 tab 栏的空间
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  webView: {
    flex: 1,
  },
  hidden: {
    opacity: 0, // 使用 opacity 而不是 display:none，确保 WebView 继续运行
    pointerEvents: 'none', // 禁用交互
  },
}); 