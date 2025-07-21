# WebView SDK 使用指南

## 概述

WebView SDK 提供了在应用 UI 中直接显示 WebView 内容的功能，支持跨平台使用。

## 快速开始

### 1. 安装依赖

```bash
npm install @native/offscreen-webview-sdk
```

### 2. 基本使用

```typescript
import React, { useState, useEffect } from 'react';
import { View, Button } from 'react-native';
import { createWebView, isWebViewSupported } from '@native/offscreen-webview-sdk';

const WebViewExample = () => {
  const [webViewInstance, setWebViewInstance] = useState<any>(null);
  const [WebViewComponent, setWebViewComponent] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    const initWebView = async () => {
      if (!isWebViewSupported()) {
        console.log('平台不支持');
        return;
      }

      const instance = await createWebView({
        width: 375,
        height: 667,
        url: 'https://example.com',
        visible: false,
        javaScriptEnabled: true,
        debug: true
      });

      setWebViewInstance(instance);
      setWebViewComponent(() => instance.getComponent());
    };

    initWebView();
  }, []);

  const showWebView = () => webViewInstance?.show();
  const hideWebView = () => webViewInstance?.hide();

  return (
    <View style={{ flex: 1 }}>
      <Button title="显示" onPress={showWebView} />
      <Button title="隐藏" onPress={hideWebView} />
      
      {WebViewComponent && (
        <WebViewComponent>
          <View />
        </WebViewComponent>
      )}
    </View>
  );
};
```

## 配置选项

### WebView 配置

```typescript
interface WebViewConfig {
  width: number;                    // WebView 宽度
  height: number;                   // WebView 高度
  url?: string;                     // 初始 URL
  html?: string;                    // 初始 HTML 内容
  visible?: boolean;                // 初始可见性
  style?: any;                      // WebView 样式
  containerStyle?: any;             // 容器样式
  javaScriptEnabled?: boolean;      // 启用 JavaScript
  domStorageEnabled?: boolean;      // 启用 DOM 存储
  allowsInlineMediaPlayback?: boolean; // 允许内联媒体播放
  mediaPlaybackRequiresUserAction?: boolean; // 媒体播放需要用户操作
  cacheEnabled?: boolean;           // 启用缓存
  cacheMode?: 'LOAD_DEFAULT' | 'LOAD_CACHE_ELSE_NETWORK' | 'LOAD_NO_CACHE' | 'LOAD_CACHE_ONLY';
  debug?: boolean;                  // 启用调试模式
}
```

## API 参考

### WebView 实例方法

```typescript
interface WebViewInstance {
  // UI 控制
  show(): void;                     // 显示 WebView
  hide(): void;                     // 隐藏 WebView
  isVisible(): boolean;             // 检查是否可见
  isLoaded(): boolean;              // 检查是否已加载
  getComponent(): React.ComponentType<any>; // 获取 React 组件
  
  // 页面操作
  loadUrl(url: string): Promise<void>;
  loadHTML(html: string, baseURL?: string): Promise<void>;
  reload(): Promise<void>;
  
  // JavaScript 执行
  executeJavaScript(script: string): Promise<any>;
  
  // 页面信息
  getPageContent(): Promise<string>;
  getPageTitle(): Promise<string>;
  getCurrentUrl(): Promise<string>;
  
  // 导航
  goBack(): Promise<void>;
  goForward(): Promise<void>;
  
  // 生命周期
  destroy(): Promise<void>;
}
```

### SDK 方法

```typescript
// 创建实例
const webView = await createWebView(config);

// 检查支持
const supported = isWebViewSupported();

// 获取平台
const platform = getWebViewPlatform();

// 获取版本
const version = getWebViewVersion();
```

## 最佳实践

### 1. 内存管理

```typescript
// 始终在组件卸载时销毁 WebView 实例
useEffect(() => {
  let webViewInstance: any = null;
  
  const initWebView = async () => {
    webViewInstance = await createWebView(config);
  };
  
  initWebView();
  
  return () => {
    if (webViewInstance) {
      webViewInstance.destroy();
    }
  };
}, []);
```

### 2. 错误处理

```typescript
const initWebView = async () => {
  try {
    if (!isWebViewSupported()) {
      console.log('平台不支持');
      return;
    }
    
    const instance = await createWebView(config);
    // 使用实例...
  } catch (error) {
    console.error('WebView 初始化失败:', error);
    // 回退到其他实现
  }
};
```

### 3. 性能优化

```typescript
// 对于频繁使用的 WebView，考虑复用实例
const [webViewInstance, setWebViewInstance] = useState<any>(null);

const loadPage = async (url: string) => {
  if (!webViewInstance) {
    const instance = await createWebView(config);
    setWebViewInstance(instance);
  }
  
  await webViewInstance.loadUrl(url);
};
```

## 常见问题

### Q: 为什么我的 WebView 不显示？

A: 确保：
1. 调用了 `show()` 方法
2. WebView 组件已正确渲染
3. 容器样式没有遮挡 WebView

### Q: JavaScript 执行失败怎么办？

A: 检查：
1. `javaScriptEnabled` 是否设置为 `true`
2. 页面是否已完全加载
3. JavaScript 代码是否有语法错误

### Q: 如何处理网络错误？

A: 使用 try-catch 包装网络操作：

```typescript
try {
  await webView.loadUrl('https://example.com');
} catch (error) {
  console.error('加载失败:', error);
  // 显示错误信息或重试
}
```

### Q: 如何监听页面加载状态？

A: 使用轮询或事件监听：

```typescript
// 轮询方式
const checkLoaded = setInterval(() => {
  if (webViewInstance.isLoaded()) {
    console.log('页面已加载');
    clearInterval(checkLoaded);
  }
}, 100);
```

## 平台支持

- ✅ Android (使用原生 WebView)
- ✅ iOS (使用 WKWebView)
- ✅ Web (使用 iframe)
- ❌ 其他平台

## 示例代码

更多示例请查看 `examples/` 目录：

- `ui-webview-example.tsx` - WebView 完整示例 