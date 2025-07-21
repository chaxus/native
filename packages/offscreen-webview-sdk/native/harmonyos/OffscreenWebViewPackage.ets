import { OffscreenWebViewModule } from './OffscreenWebViewModule';

/**
 * 鸿蒙系统 WebView 包配置
 * 用于注册和管理 WebView 模块
 */
export class OffscreenWebViewPackage {
  private static instance: OffscreenWebViewPackage | null = null;
  private modules: Map<string, OffscreenWebViewModule> = new Map();

  /**
   * 获取单例实例
   */
  static getInstance(): OffscreenWebViewPackage {
    if (!OffscreenWebViewPackage.instance) {
      OffscreenWebViewPackage.instance = new OffscreenWebViewPackage();
    }
    return OffscreenWebViewPackage.instance;
  }

  /**
   * 创建 WebView 模块实例
   */
  async createModule(instanceId: string, config: {
    width: number;
    height: number;
    url?: string;
    html?: string;
    userAgent?: string;
    javaScriptEnabled?: boolean;
    domStorageEnabled?: boolean;
    cacheEnabled?: boolean;
  }): Promise<OffscreenWebViewModule> {
    // 检查是否已存在
    if (this.modules.has(instanceId)) {
      throw new Error(`Module with ID ${instanceId} already exists`);
    }

    // 创建新模块
    const module = new OffscreenWebViewModule();
    await module.createWebView(config);
    
    // 注册模块
    this.modules.set(instanceId, module);
    
    console.log(`HarmonyOS WebView module created with ID: ${instanceId}`);
    return module;
  }

  /**
   * 获取模块实例
   */
  getModule(instanceId: string): OffscreenWebViewModule | undefined {
    return this.modules.get(instanceId);
  }

  /**
   * 销毁模块实例
   */
  async destroyModule(instanceId: string): Promise<void> {
    const module = this.modules.get(instanceId);
    if (module) {
      await module.destroy();
      this.modules.delete(instanceId);
      console.log(`HarmonyOS WebView module destroyed with ID: ${instanceId}`);
    }
  }

  /**
   * 销毁所有模块
   */
  async destroyAllModules(): Promise<void> {
    const destroyPromises = Array.from(this.modules.keys()).map(id => 
      this.destroyModule(id)
    );
    await Promise.all(destroyPromises);
    console.log('All HarmonyOS WebView modules destroyed');
  }

  /**
   * 获取模块数量
   */
  getModuleCount(): number {
    return this.modules.size;
  }

  /**
   * 检查模块是否存在
   */
  hasModule(instanceId: string): boolean {
    return this.modules.has(instanceId);
  }

  /**
   * 获取所有模块ID
   */
  getAllModuleIds(): string[] {
    return Array.from(this.modules.keys());
  }
} 