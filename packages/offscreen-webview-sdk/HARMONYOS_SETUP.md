# 鸿蒙系统 WebView SDK 设置指南

本文档介绍如何在鸿蒙系统中使用 Offscreen WebView SDK。

## 系统要求

- HarmonyOS 9.0 或更高版本
- DevEco Studio 3.0 或更高版本
- Node.js 16.0 或更高版本

## 安装依赖

### 1. 安装 SDK

```bash
npm install @native/offscreen-webview-sdk
```

### 2. 鸿蒙系统依赖

在 `package.json` 中添加鸿蒙系统依赖：

```json
{
  "dependencies": {
    "@ohos/web.webview": "^1.0.0"
  }
}
```

## 配置

### 1. 应用配置

在 `app.json` 中添加鸿蒙配置：

```json
{
  "expo": {
    "harmonyos": {
      "package": "com.yourcompany.yourapp",
      "minPlatformVersion": 9,
      "targetPlatformVersion": 9,
      "icon": "./assets/images/icon.png",
      "label": "Your App",
      "description": "Your app description"
    }
  }
}
```

### 2. 权限配置

在 `module.json5` 中添加必要的权限：

```json
{
  "module": {
    "requestPermissions": [
      {
        "name": "ohos.permission.INTERNET"
      },
      {
        "name": "ohos.permission.ACCESS_NETWORK_STATE"
      }
    ]
  }
}
```

## 使用方法

### 1. 基本使用

```typescript
import webViewSDK, { createWebView } from '@native/offscreen-webview-sdk';

// 检查平台支持
if (webViewSDK.isSupported()) {
  // 创建 WebView 实例
  const webView = await createWebView({
    width: 400,
    height: 600,
    url: 'https://www.example.com',
    javaScriptEnabled: true,
    domStorageEnabled: true,
    cacheEnabled: true,
    visible: false,
  });

  // 显示 WebView
  webView.show();

  // 加载新 URL
  await webView.loadUrl('https://www.baidu.com');

  // 执行 JavaScript
  const result = await webView.executeJavaScript('document.title');

  // 获取页面信息
  const title = await webView.getPageTitle();
  const url = await webView.getCurrentUrl();

  // 隐藏 WebView
  webView.hide();

  // 销毁实例
  await webView.destroy();
}
```

### 2. React 组件集成

```typescript
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { createWebView } from '@native/offscreen-webview-sdk';

function MyComponent() {
  const [webViewInstance, setWebViewInstance] = useState(null);

  useEffect(() => {
    const initWebView = async () => {
      const instance = await createWebView({
        width: 400,
        height: 600,
        url: 'https://www.example.com',
        visible: true,
      });
      setWebViewInstance(instance);
    };

    initWebView();
  }, []);

  return (
    <View>
      {webViewInstance && webViewInstance.getComponent() && 
        React.createElement(webViewInstance.getComponent(), {}, null)
      }
    </View>
  );
}
```

## 构建

### 1. 开发构建

```bash
npm run build:harmonyos
```

### 2. 生产构建

```bash
eas build --platform harmonyos --profile production
```

### 3. 预览构建

```bash
eas build --platform harmonyos --profile preview
```

## 特性

### 鸿蒙系统特定功能

1. **原生 WebView 支持**: 使用鸿蒙系统的原生 WebView 组件
2. **高性能渲染**: 利用鸿蒙系统的 ArkUI 渲染引擎
3. **系统集成**: 与鸿蒙系统的权限和生命周期管理集成
4. **离线缓存**: 支持鸿蒙系统的离线缓存机制

### 配置选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `width` | number | 必需 | WebView 宽度 |
| `height` | number | 必需 | WebView 高度 |
| `url` | string | - | 初始 URL |
| `html` | string | - | 初始 HTML 内容 |
| `javaScriptEnabled` | boolean | true | 是否启用 JavaScript |
| `domStorageEnabled` | boolean | true | 是否启用 DOM 存储 |
| `cacheEnabled` | boolean | true | 是否启用缓存 |
| `userAgent` | string | - | 自定义用户代理 |
| `visible` | boolean | false | 是否可见 |

## 注意事项

1. **权限管理**: 确保应用有网络访问权限
2. **内存管理**: 及时销毁不需要的 WebView 实例
3. **错误处理**: 处理网络错误和 JavaScript 执行错误
4. **性能优化**: 避免创建过多 WebView 实例

## 故障排除

### 常见问题

1. **WebView 无法加载**
   - 检查网络权限
   - 验证 URL 格式
   - 确认网络连接

2. **JavaScript 执行失败**
   - 检查 JavaScript 是否启用
   - 验证脚本语法
   - 确认页面已完全加载

3. **内存泄漏**
   - 确保调用 `destroy()` 方法
   - 检查组件生命周期
   - 避免循环引用

### 调试

启用调试模式：

```typescript
const webView = await createWebView({
  // ... 其他配置
  debug: true,
});
```

## 示例

完整的使用示例请参考 `examples/harmonyos-webview-example.tsx`。

## 支持

如有问题，请查看：
- [鸿蒙系统开发文档](https://developer.harmonyos.com/)
- [WebView API 文档](https://developer.harmonyos.com/cn/docs/documentation/doc-references/js-apis-webview-0000001057417483)
- [项目 Issues](https://github.com/your-repo/issues) 