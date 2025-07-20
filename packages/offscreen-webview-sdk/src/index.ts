import { Platform } from 'react-native';
import {
    OffscreenWebViewConfig,
    OffscreenWebViewInstance,
    OffscreenWebViewSDK
} from '../types';

class OffscreenWebViewSDKImpl implements OffscreenWebViewSDK {
  private version = '1.0.0';
  private instances: Map<string, OffscreenWebViewInstance> = new Map();

  /**
   * 创建离屏 WebView 实例
   */
  async createInstance(config: OffscreenWebViewConfig): Promise<OffscreenWebViewInstance> {
    const instanceId = this.generateInstanceId();
    
    // 根据平台创建不同的实现
    let instance: OffscreenWebViewInstance;
    
    switch (this.getPlatform()) {
      case 'android':
        instance = await this.createAndroidInstance(config, instanceId);
        break;
      case 'ios':
        instance = await this.createIOSInstance(config, instanceId);
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
    return ['android', 'ios', 'web'].includes(this.getPlatform());
  }

  /**
   * 获取平台信息
   */
  getPlatform(): 'android' | 'ios' | 'web' | 'unknown' {
    if (Platform.OS === 'android') return 'android';
    if (Platform.OS === 'ios') return 'ios';
    if (Platform.OS === 'web') return 'web';
    return 'unknown';
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
    return `offscreen-webview-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 创建 Android 平台实例
   */
  private async createAndroidInstance(config: OffscreenWebViewConfig, instanceId: string): Promise<OffscreenWebViewInstance> {
    // 这里将调用 Android 原生模块
    const { OffscreenWebViewModule } = require('../android/OffscreenWebViewModule');
    
    return new OffscreenWebViewModule(instanceId, config);
  }

  /**
   * 创建 iOS 平台实例
   */
  private async createIOSInstance(config: OffscreenWebViewConfig, instanceId: string): Promise<OffscreenWebViewInstance> {
    // 这里将调用 iOS 原生模块
    const { OffscreenWebViewModule } = require('../ios/OffscreenWebViewModule');
    
    return new OffscreenWebViewModule(instanceId, config);
  }

  /**
   * 创建 Web 平台实例
   */
  private async createWebInstance(config: OffscreenWebViewConfig, instanceId: string): Promise<OffscreenWebViewInstance> {
    // Web 平台使用 iframe 或隐藏的 div 实现
    const { WebOffscreenWebView } = require('../web/WebOffscreenWebView');
    
    return new WebOffscreenWebView(instanceId, config);
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
const offscreenWebViewSDK = new OffscreenWebViewSDKImpl();

// 导出 SDK 实例和类型
export default offscreenWebViewSDK;
export * from '../types';

// 导出便捷方法
export const createOffscreenWebView = (config: OffscreenWebViewConfig) => 
  offscreenWebViewSDK.createInstance(config);

export const isOffscreenWebViewSupported = () => 
  offscreenWebViewSDK.isSupported();

export const getOffscreenWebViewPlatform = () => 
  offscreenWebViewSDK.getPlatform();

export const getOffscreenWebViewVersion = () => 
  offscreenWebViewSDK.getVersion(); 