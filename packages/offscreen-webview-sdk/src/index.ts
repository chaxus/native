import { Platform } from 'react-native';
import type {
  WebViewConfig,
  WebViewInstance,
  WebViewSDK
} from './types';

class WebViewSDKImpl implements WebViewSDK {
  private version = '1.0.0';
  private instances: Map<string, WebViewInstance> = new Map();

  /**
   * 创建 WebView 实例
   */
  async createInstance(config: WebViewConfig): Promise<WebViewInstance> {
    const instanceId = this.generateInstanceId();
    
    // 根据平台创建不同的实现
    let instance: WebViewInstance;
    
    switch (this.getPlatform()) {
      case 'android':
      case 'ios':
        instance = await this.createReactNativeInstance(config, instanceId);
        break;
      case 'harmonyos':
        instance = await this.createHarmonyOSInstance(config, instanceId);
        break;
      case 'web':
        instance = await this.createWebInstance(config, instanceId);
        break;
      default:
        throw new Error(`Platform ${this.getPlatform()} is not supported`);
    }

    this.instances.set(instanceId, instance);
    return instance;
  }

  /**
   * 检查平台支持
   */
  isSupported(): boolean {
    return ['android', 'ios', 'web', 'harmonyos'].includes(this.getPlatform());
  }

  /**
   * 获取平台信息
   */
  getPlatform(): 'android' | 'ios' | 'web' | 'harmonyos' | 'unknown' {
    if (Platform.OS === 'android') {
      // 检测是否为鸿蒙系统
      if (this.isHarmonyOS()) {
        return 'harmonyos';
      }
      return 'android';
    }
    if (Platform.OS === 'ios') return 'ios';
    if (Platform.OS === 'web') return 'web';
    return 'unknown';
  }

  /**
   * 检测是否为鸿蒙系统
   */
  private isHarmonyOS(): boolean {
    try {
      // 通过系统信息检测鸿蒙系统
      const systemInfo = (global as any).systemInfo;
      if (systemInfo && systemInfo.osType === 'HarmonyOS') {
        return true;
      }
      
      // 通过用户代理检测
      if (typeof navigator !== 'undefined' && navigator.userAgent) {
        return navigator.userAgent.includes('HarmonyOS') || 
               navigator.userAgent.includes('HUAWEI');
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * 获取版本信息
   */
  getVersion(): string {
    return this.version;
  }

  /**
   * 生成实例 ID
   */
  private generateInstanceId(): string {
    return `webview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 创建 React Native 实例
   */
  private async createReactNativeInstance(config: WebViewConfig, instanceId: string): Promise<WebViewInstance> {
    // React Native 平台使用 react-native-webview 实现
    const { ReactNativeWebView } = require('./platforms/ReactNativeWebView');
    
    return new ReactNativeWebView(instanceId, config);
  }

  /**
   * 创建鸿蒙系统实例
   */
  private async createHarmonyOSInstance(config: WebViewConfig, instanceId: string): Promise<WebViewInstance> {
    // 鸿蒙系统使用专门的 HarmonyOS WebView 实现
    const { HarmonyOSWebView } = require('./platforms/HarmonyOSWebView');
    
    return new HarmonyOSWebView(instanceId, config);
  }

  /**
   * 创建 Web 平台实例
   */
  private async createWebInstance(config: WebViewConfig, instanceId: string): Promise<WebViewInstance> {
    // Web 平台使用 iframe 实现
    const { WebOffscreenWebView } = require('./platforms/WebOffscreenWebView');
    
    // 这里需要扩展 WebOffscreenWebView 来支持 UI 功能
    return new WebOffscreenWebView(instanceId, config) as WebViewInstance;
  }

  /**
   * 销毁所有实例
   */
  async destroyAllInstances(): Promise<void> {
    const destroyPromises = Array.from(this.instances.values()).map(instance => instance.destroy());
    await Promise.all(destroyPromises);
    this.instances.clear();
  }

  /**
   * 获取实例数量
   */
  getInstanceCount(): number {
    return this.instances.size;
  }
}

// 创建单例实例
const webViewSDK = new WebViewSDKImpl();

// 导出 SDK 实例
export default webViewSDK;

// 导出类型
export type {
  JavaScriptExecutionOptions, NavigationOptions, WebViewConfig, WebViewEvent, WebViewInstance,
  WebViewSDK
} from './types';

// 导出便捷方法
export const createWebView = (config: WebViewConfig) => 
  webViewSDK.createInstance(config);

export const isWebViewSupported = () => 
  webViewSDK.isSupported();

export const getWebViewPlatform = () => 
  webViewSDK.getPlatform();

export const getWebViewVersion = () => 
  webViewSDK.getVersion(); 