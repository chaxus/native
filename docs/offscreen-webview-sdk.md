# Offscreen WebView SDK 使用指南

## 概述

Offscreen WebView SDK 是一个跨平台的离屏渲染 WebView 解决方案，支持 React Native、Android、iOS 和 Web 平台。它允许你在后台运行 WebView，不占用 UI 线程，适合用于网页截图、内容抓取、自动化测试等场景。

## 📁 项目结构

```
packages/offscreen-webview-sdk/
├── src/                    # 核心源码
│   └── index.ts           # 主入口文件
├── types/                  # TypeScript 类型定义
│   └── index.d.ts         # 类型声明
├── android/                # Android 平台实现
│   └── OffscreenWebViewModule.ts
├── ios/                    # iOS 平台实现
│   └── OffscreenWebViewModule.ts
├── web/                    # Web 平台实现
│   └── WebOffscreenWebView.ts
├── examples/               # 使用示例
│   └── react-native-example.tsx
├── package.json           # 包配置
├── tsconfig.json          # TypeScript 配置
└── README.md              # 详细文档
```

## 🚀 快速开始

### 1. 安装依赖

```bash
cd packages/offscreen-webview-sdk
npm install
```

### 2. 构建 SDK

```bash
npm run build
```

### 3. 在项目中使用

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

// 使用 WebView
await webView.loadUrl('https://reactnative.dev');
const screenshot = await webView.captureScreenshot();
await webView.destroy();
```

## 📚 API 参考

### 配置选项

| 属性 | 类型 | 必填 | 描述 |
|------|------|------|------|
| `width` | `number` | ✅ | WebView 宽度 |
| `height` | `number` | ✅ | WebView 高度 |
| `url` | `string` | ❌ | 初始 URL |
| `html` | `string` | ❌ | 初始 HTML 内容 |
| `userAgent` | `string` | ❌ | 用户代理字符串 |
| `javaScriptEnabled` | `boolean` | ❌ | 是否启用 JavaScript |
| `allowFileAccess` | `boolean` | ❌ | 是否允许文件访问 |
| `headers` | `Record<string, string>` | ❌ | 自定义请求头 |
| `injectedJavaScript` | `string` | ❌ | 注入的 JavaScript 代码 |
| `debug` | `boolean` | ❌ | 是否启用调试模式 |

### 实例方法

#### 页面加载
- `loadUrl(url: string): Promise<void>` - 加载 URL
- `loadHTML(html: string, baseURL?: string): Promise<void>` - 加载 HTML 内容

#### JavaScript 执行
- `executeJavaScript(script: string): Promise<any>` - 执行 JavaScript 代码

#### 页面信息
- `getPageContent(): Promise<string>` - 获取页面内容
- `getPageTitle(): Promise<string>` - 获取页面标题
- `getCurrentUrl(): Promise<string>` - 获取当前 URL

#### 截图
- `captureScreenshot(): Promise<string>` - 获取页面截图

#### 导航
- `goBack(): Promise<boolean>` - 返回上一页
- `goForward(): Promise<boolean>` - 前进到下一页
- `reload(): Promise<void>` - 刷新页面
- `stopLoading(): Promise<void>` - 停止加载

#### 生命周期
- `destroy(): Promise<void>` - 销毁实例

## 🎯 使用场景

### 1. 网页截图

```typescript
const webView = await createOffscreenWebView({
  width: 1920,
  height: 1080,
  url: 'https://example.com'
});

await webView.loadUrl('https://reactnative.dev');
const screenshot = await webView.captureScreenshot();
await webView.destroy();

// 保存截图
saveScreenshot(screenshot);
```

### 2. 内容抓取

```typescript
const webView = await createOffscreenWebView({
  width: 375,
  height: 667,
  url: 'https://news.example.com'
});

await webView.loadUrl('https://news.example.com');

// 执行 JavaScript 提取数据
const articles = await webView.executeJavaScript(`
  Array.from(document.querySelectorAll('.article')).map(article => ({
    title: article.querySelector('.title').textContent,
    content: article.querySelector('.content').textContent,
    date: article.querySelector('.date').textContent
  }))
`);

await webView.destroy();
console.log('抓取到的文章:', articles);
```

### 3. 自动化测试

```typescript
const webView = await createOffscreenWebView({
  width: 375,
  height: 667,
  url: 'https://app.example.com'
});

// 登录测试
await webView.loadUrl('https://app.example.com/login');
await webView.executeJavaScript(`
  document.getElementById('username').value = 'test@example.com';
  document.getElementById('password').value = 'password123';
  document.getElementById('login-btn').click();
`);

// 等待登录完成
await new Promise(resolve => setTimeout(resolve, 2000));

// 验证登录状态
const isLoggedIn = await webView.executeJavaScript(`
  document.querySelector('.user-profile') !== null
`);

await webView.destroy();
console.log('登录测试结果:', isLoggedIn);
```

## 🔧 平台特定配置

### Android

确保 `AndroidManifest.xml` 包含网络权限：

```xml
<uses-permission android:name="android.permission.INTERNET" />
```

### iOS

在 `Info.plist` 中配置 App Transport Security：

```xml
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

### Web

Web 平台使用隐藏的 iframe 实现，支持所有现代浏览器。

## 🚨 注意事项

1. **内存管理**: 及时销毁不需要的 WebView 实例
2. **网络权限**: 确保应用有适当的网络权限
3. **跨域限制**: Web 平台可能受到跨域限制
4. **性能考虑**: 大量实例可能影响性能
5. **平台差异**: 不同平台的行为可能略有差异

## 🛠️ 开发指南

### 构建 SDK

```bash
cd packages/offscreen-webview-sdk
npm run build
```

### 运行测试

```bash
npm test
```

### 代码检查

```bash
npm run lint
```

### 格式化代码

```bash
npm run format
```

### 发布包

```bash
npm publish
```

## 🔗 相关资源

- [SDK 源码](../packages/offscreen-webview-sdk/)
- [使用示例](../packages/offscreen-webview-sdk/examples/)
- [API 文档](../packages/offscreen-webview-sdk/README.md)
- [React Native WebView](https://github.com/react-native-webview/react-native-webview) 