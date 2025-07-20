# Offscreen WebView SDK

[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[English](README.en.md) | [中文](README.md)

一个跨平台的离屏 WebView SDK，支持 React Native、Android、iOS 和 Web 平台。提供强大的后台网页处理能力，适用于网页截图、内容抓取、自动化测试等场景。

## 🚀 特性

- ✅ **跨平台支持**: React Native、Android、iOS、Web
- ✅ **离屏渲染**: 在后台运行，不占用 UI 线程
- ✅ **JavaScript 执行**: 支持在 WebView 中执行 JavaScript 代码
- ✅ **页面截图**: 获取 WebView 内容的截图
- ✅ **页面操作**: 导航、刷新、获取内容等
- ✅ **事件监听**: 支持页面加载、错误等事件
- ✅ **TypeScript 支持**: 完整的类型定义
- ✅ **轻量级**: 最小化依赖，易于集成

## 📦 安装

```bash
npm install @native/offscreen-webview-sdk
# 或
yarn add @native/offscreen-webview-sdk
# 或
pnpm add @native/offscreen-webview-sdk
```

## 🛠️ 快速开始

### React Native 使用示例

```typescript
import { createOffscreenWebView, isOffscreenWebViewSupported } from '@native/offscreen-webview-sdk';

// 检查平台支持
if (!isOffscreenWebViewSupported()) {
  console.log('当前平台不支持离屏 WebView');
  return;
}

// 创建 WebView 实例
const webView = await createOffscreenWebView({
  width: 375,
  height: 667,
  url: 'https://example.com',
  javaScriptEnabled: true,
  debug: true
});

// 加载页面
await webView.loadUrl('https://reactnative.dev');

// 执行 JavaScript
const result = await webView.executeJavaScript(`
  document.title = 'Modified by SDK';
  document.title;
`);

// 获取页面截图
const screenshot = await webView.captureScreenshot();

// 获取页面内容
const content = await webView.getPageContent();

// 销毁实例
await webView.destroy();
```

### 完整示例

```typescript
import React, { useEffect, useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { createOffscreenWebView } from '@native/offscreen-webview-sdk';

const App = () => {
  const [webView, setWebView] = useState<any>(null);

  const createWebView = async () => {
    try {
      const instance = await createOffscreenWebView({
        width: 375,
        height: 667,
        url: 'https://example.com',
        javaScriptEnabled: true,
        userAgent: 'OffscreenWebView/1.0',
        injectedJavaScript: `
          console.log('WebView initialized');
          window.ReactNativeWebView = {
            postMessage: (data) => {
              console.log('Message:', data);
            }
          };
        `
      });
      
      setWebView(instance);
      Alert.alert('成功', 'WebView 创建成功');
    } catch (error) {
      Alert.alert('错误', `创建失败: ${error}`);
    }
  };

  const loadPage = async () => {
    if (!webView) return;
    
    try {
      await webView.loadUrl('https://reactnative.dev');
      const title = await webView.getPageTitle();
      Alert.alert('页面标题', title);
    } catch (error) {
      Alert.alert('错误', `加载失败: ${error}`);
    }
  };

  const takeScreenshot = async () => {
    if (!webView) return;
    
    try {
      const screenshot = await webView.captureScreenshot();
      // 处理截图数据
      console.log('截图:', screenshot.substring(0, 100));
    } catch (error) {
      Alert.alert('错误', `截图失败: ${error}`);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Button title="创建 WebView" onPress={createWebView} />
      <Button title="加载页面" onPress={loadPage} />
      <Button title="截图" onPress={takeScreenshot} />
    </View>
  );
};
```

## 📚 API 文档

### 配置选项

```typescript
interface OffscreenWebViewConfig {
  width: number;                    // WebView 宽度
  height: number;                   // WebView 高度
  url?: string;                     // 初始 URL
  html?: string;                    // 初始 HTML 内容
  userAgent?: string;               // 用户代理字符串
  javaScriptEnabled?: boolean;      // 是否启用 JavaScript
  allowFileAccess?: boolean;        // 是否允许文件访问
  allowUniversalAccessFromFileURLs?: boolean; // 是否允许通用文件访问
  headers?: Record<string, string>; // 自定义请求头
  injectedJavaScript?: string;      // 注入的 JavaScript 代码
  debug?: boolean;                  // 是否启用调试模式
}
```

### 实例方法

```typescript
interface OffscreenWebViewInstance {
  // 页面加载
  loadUrl(url: string): Promise<void>;
  loadHTML(html: string, baseURL?: string): Promise<void>;
  
  // JavaScript 执行
  executeJavaScript(script: string): Promise<any>;
  
  // 页面信息
  getPageContent(): Promise<string>;
  getPageTitle(): Promise<string>;
  getCurrentUrl(): Promise<string>;
  
  // 截图
  captureScreenshot(): Promise<string>;
  
  // 导航
  goBack(): Promise<boolean>;
  goForward(): Promise<boolean>;
  reload(): Promise<void>;
  stopLoading(): Promise<void>;
  
  // 生命周期
  destroy(): Promise<void>;
}
```

### SDK 方法

```typescript
// 创建实例
const webView = await createOffscreenWebView(config);

// 检查支持
const supported = isOffscreenWebViewSupported();

// 获取平台
const platform = getOffscreenWebViewPlatform();

// 获取版本
const version = getOffscreenWebViewVersion();
```

## 🔧 平台特定配置

### Android

Android 平台使用原生 WebView 实现，需要确保应用有网络权限：

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
```

### iOS

iOS 平台使用 WKWebView 实现，需要配置 App Transport Security：

```xml
<!-- Info.plist -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

### Web

Web 平台使用隐藏的 iframe 实现，支持所有现代浏览器。

## 🎯 使用场景

- **网页截图**: 批量生成网页截图
- **内容抓取**: 抓取网页内容进行数据分析
- **自动化测试**: 在后台运行网页测试
- **预渲染**: 预加载和渲染网页内容
- **数据提取**: 从网页中提取结构化数据

## 🚨 注意事项

1. **内存管理**: 及时销毁不需要的 WebView 实例
2. **网络权限**: 确保应用有适当的网络权限
3. **跨域限制**: Web 平台可能受到跨域限制
4. **性能考虑**: 大量实例可能影响性能
5. **平台差异**: 不同平台的行为可能略有差异

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [React Native WebView](https://github.com/react-native-webview/react-native-webview)
- [WKWebView 文档](https://developer.apple.com/documentation/webkit/wkwebview)
- [Android WebView 文档](https://developer.android.com/reference/android/webkit/WebView) 