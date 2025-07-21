# React Native 集成指南

本指南介绍如何在 React Native 项目中集成和使用 `offscreen-webview-sdk`。

## 🚀 快速开始

### 1. 安装依赖

```bash
# 安装 SDK
npm install @native/offscreen-webview-sdk

# 安装必要的依赖
npm install react-native-webview
```

### 2. 在项目中使用

```tsx
import React from 'react';
import { View, Text } from 'react-native';
import { createWebView } from '@native/offscreen-webview-sdk';

const App = () => {
  const [webView, setWebView] = React.useState(null);

  React.useEffect(() => {
    // 创建 WebView 实例
    const webViewInstance = createWebView({
      url: 'https://example.com',
      onLoad: () => console.log('WebView loaded'),
      onError: (error) => console.error('WebView error:', error),
    });

    setWebView(webViewInstance);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Text>WebView SDK Demo</Text>
      {webView && webView.render()}
    </View>
  );
};

export default App;
```

## 📦 构建和发布

### 本地开发

```bash
# 进入 SDK 目录
cd packages/offscreen-webview-sdk

# 构建 TypeScript
npm run build

# 创建本地包
npm run pack
```

### 在项目中使用本地包

```bash
# 在项目根目录
npm install ./packages/offscreen-webview-sdk/native-offscreen-webview-sdk-1.0.0.tgz
```

### 发布到 NPM

```bash
# 构建并发布
npm run build
npm publish
```

## 🔧 配置说明

### Metro 配置

如果你的项目使用 Metro bundler，确保 `metro.config.js` 包含：

```javascript
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 添加对本地包的支持
config.resolver.nodeModulesPaths = [
  ...config.resolver.nodeModulesPaths,
  './packages',
];

module.exports = config;
```

### TypeScript 配置

在 `tsconfig.json` 中添加：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@native/offscreen-webview-sdk": ["./packages/offscreen-webview-sdk/dist"]
    }
  }
}
```

## 📱 平台特定配置

### Android

确保 `android/app/build.gradle` 包含：

```gradle
dependencies {
    implementation "com.facebook.react:react-native-webview:13.6.0"
}
```

### iOS

确保 `ios/Podfile` 包含：

```ruby
pod 'react-native-webview', :path => '../node_modules/react-native-webview'
```

然后运行：

```bash
cd ios && pod install
```

## 🎯 使用示例

### 基本 WebView

```tsx
import { createWebView } from '@native/offscreen-webview-sdk';

const webView = createWebView({
  url: 'https://reactnative.dev',
  style: { flex: 1 },
});
```

### 带事件处理的 WebView

```tsx
const webView = createWebView({
  url: 'https://example.com',
  onLoad: () => console.log('页面加载完成'),
  onError: (error) => console.error('加载错误:', error),
  onMessage: (message) => console.log('收到消息:', message),
  injectedJavaScript: `
    window.ReactNativeWebView.postMessage('Hello from WebView');
  `,
});
```

### 自定义配置

```tsx
const webView = createWebView({
  url: 'https://example.com',
  userAgent: 'Custom User Agent',
  allowsInlineMediaPlayback: true,
  mediaPlaybackRequiresUserAction: false,
  javaScriptEnabled: true,
  domStorageEnabled: true,
  startInLoadingState: true,
  scalesPageToFit: true,
});
```

## 🐛 故障排除

### 常见问题

1. **模块找不到**：
   ```bash
   # 清理缓存
   npx react-native start --reset-cache
   ```

2. **类型错误**：
   ```bash
   # 重新安装依赖
   rm -rf node_modules && npm install
   ```

3. **WebView 不显示**：
   - 确保容器有明确的尺寸
   - 检查 URL 是否有效
   - 查看控制台错误信息

### 调试技巧

```tsx
// 启用调试模式
const webView = createWebView({
  url: 'https://example.com',
  onLoad: () => console.log('WebView loaded'),
  onError: (error) => console.error('WebView error:', error),
  onMessage: (message) => console.log('WebView message:', message),
  // 启用调试
  debuggingEnabled: __DEV__,
});
```

## 📚 更多资源

- [React Native WebView 文档](https://github.com/react-native-webview/react-native-webview)
- [React Native 原生模块开发](https://reactnative.dev/docs/native-modules-intro)
- [TypeScript 配置指南](https://www.typescriptlang.org/docs/) 