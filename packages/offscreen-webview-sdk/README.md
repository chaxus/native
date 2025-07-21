# WebView SDK

[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[English](README.md) | [中文](README.zh-CN.md)

A cross-platform WebView SDK that supports React Native, Android, iOS, and Web platforms. Provides powerful WebView integration for displaying web content directly in your app UI, suitable for inline web content display, web-based features, and hybrid app development.

## 🚀 Features

- ✅ **Cross-Platform Support**: React Native, Android, iOS, Web
- ✅ **UI Integration**: Display WebView content directly in your app UI
- ✅ **JavaScript Execution**: Execute JavaScript code in WebView
- ✅ **Page Operations**: Navigation, refresh, content retrieval, etc.
- ✅ **Event Listening**: Support for page loading, error events, etc.
- ✅ **TypeScript Support**: Complete type definitions
- ✅ **Lightweight**: Minimal dependencies, easy to integrate
- ✅ **Memory Management**: Automatic resource cleanup

## 📦 Installation

```bash
npm install @native/offscreen-webview-sdk
# or
yarn add @native/offscreen-webview-sdk
# or
pnpm add @native/offscreen-webview-sdk
```

## 🛠️ Quick Start

### Basic Usage

```typescript
import React, { useState, useEffect } from 'react';
import { View, Button } from 'react-native';
import { createWebView, isWebViewSupported } from '@native/offscreen-webview-sdk';

const App = () => {
  const [webViewInstance, setWebViewInstance] = React.useState<any>(null);
  const [WebViewComponent, setWebViewComponent] = React.useState<React.ComponentType<any> | null>(null);

  React.useEffect(() => {
    const initWebView = async () => {
      if (!isWebViewSupported()) {
        console.log('Platform not supported');
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

  const showWebView = () => {
    webViewInstance?.show();
  };

  const hideWebView = () => {
    webViewInstance?.hide();
  };

  return (
    <View style={{ flex: 1 }}>
      <Button title="Show WebView" onPress={showWebView} />
      <Button title="Hide WebView" onPress={hideWebView} />
      
      {WebViewComponent && (
        <WebViewComponent>
          <View />
        </WebViewComponent>
      )}
    </View>
  );
};
```

### Advanced Usage

```typescript
import React from 'react';
import { View, Button, Alert } from 'react-native';
import { createWebView } from '@native/offscreen-webview-sdk';

const AdvancedExample = () => {
  const [webView, setWebView] = React.useState<any>(null);

  const initWebView = async () => {
    try {
      const instance = await createWebView({
        width: 375,
        height: 667,
        url: 'https://reactnative.dev',
        visible: true,
        javaScriptEnabled: true,
        domStorageEnabled: true,
        allowsInlineMediaPlayback: true,
        cacheEnabled: true,
        debug: true
      });

      setWebView(instance);
    } catch (error) {
      Alert.alert('Error', `Failed to create WebView: ${error}`);
    }
  };

  const executeJavaScript = async () => {
    if (!webView) return;

    try {
      const result = await webView.executeJavaScript('document.title');
      Alert.alert('Page Title', result);
    } catch (error) {
      Alert.alert('Error', `JavaScript execution failed: ${error}`);
    }
  };

  const loadNewPage = async () => {
    if (!webView) return;

    try {
      await webView.loadUrl('https://github.com');
    } catch (error) {
      Alert.alert('Error', `Failed to load page: ${error}`);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Initialize WebView" onPress={initWebView} />
      <Button title="Execute JavaScript" onPress={executeJavaScript} />
      <Button title="Load New Page" onPress={loadNewPage} />
    </View>
  );
};
```

## 📚 API Documentation

### WebView Configuration

```typescript
interface WebViewConfig {
  width: number;                    // WebView width
  height: number;                   // WebView height
  url?: string;                     // Initial URL
  html?: string;                    // Initial HTML content
  visible?: boolean;                // Initial visibility state
  style?: any;                      // WebView style
  containerStyle?: any;             // Container style
  userAgent?: string;               // User agent string
  javaScriptEnabled?: boolean;      // Enable JavaScript
  domStorageEnabled?: boolean;      // Enable DOM storage
  allowsInlineMediaPlayback?: boolean; // Allow inline media playback
  mediaPlaybackRequiresUserAction?: boolean; // Media playback requires user action
  cacheEnabled?: boolean;           // Enable cache
  cacheMode?: 'LOAD_DEFAULT' | 'LOAD_CACHE_ELSE_NETWORK' | 'LOAD_NO_CACHE' | 'LOAD_CACHE_ONLY';
  debug?: boolean;                  // Enable debug mode
}
```

### WebView Instance Methods

```typescript
interface WebViewInstance {
  // UI Control
  show(): void;                     // Show WebView
  hide(): void;                     // Hide WebView
  isVisible(): boolean;             // Check if visible
  isLoaded(): boolean;              // Check if loaded
  getComponent(): React.ComponentType<any>; // Get React component
  
  // Page loading
  loadUrl(url: string): Promise<void>;
  loadHTML(html: string, baseURL?: string): Promise<void>;
  
  // JavaScript execution
  executeJavaScript(script: string): Promise<any>;
  
  // Page information
  getPageContent(): Promise<string>;
  getPageTitle(): Promise<string>;
  getCurrentUrl(): Promise<string>;
  
  // Navigation
  goBack(): Promise<void>;
  goForward(): Promise<void>;
  reload(): Promise<void>;
  
  // Lifecycle
  destroy(): Promise<void>;
}
```

### SDK Methods

```typescript
// Create instance
const webView = await createWebView(config);

// Check support
const supported = isWebViewSupported();

// Get platform
const platform = getWebViewPlatform();

// Get version
const version = getWebViewVersion();
```

## 🔧 Platform-Specific Configuration

### Android

Android platform uses native WebView implementation, ensure the app has network permissions:

```xml
<!-- AndroidManifest.xml -->
<uses-permission android:name="android.permission.INTERNET" />
```

### iOS

iOS platform uses WKWebView implementation, configure App Transport Security:

```xml
<!-- Info.plist -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
</dict>
```

### Web

Web platform uses iframe implementation, supports all modern browsers.

## 🎯 Use Cases

- **Inline Web Content**: Display web content directly in your app UI
- **Hybrid Apps**: Combine native and web functionality
- **Web-based Features**: Integrate web services and features
- **Content Display**: Show web pages, forms, or web applications
- **Dynamic Content**: Load and display dynamic web content

## 🚨 Important Notes

1. **Memory Management**: Destroy WebView instances when not needed
2. **Network Permissions**: Ensure app has appropriate network permissions
3. **Cross-Origin Restrictions**: Web platform may be subject to CORS restrictions
4. **Performance Considerations**: Multiple instances may affect performance
5. **Platform Differences**: Behavior may vary slightly between platforms
6. **UI Integration**: Always wrap WebView components in proper React components

## 🤝 Contributing

Welcome to submit Issues and Pull Requests!

## 📄 License

MIT License

## 📁 Project Structure

```
packages/offscreen-webview-sdk/
├── src/                    # Core source code
│   ├── index.ts           # Main entry file
│   └── platforms/         # Platform-specific implementations
│       ├── ReactNativeWebView.ts
│       └── WebOffscreenWebView.ts
├── types/                  # TypeScript type definitions
│   └── index.d.ts         # Type declarations
├── native/                 # Native code implementations
│   ├── android/           # Android native modules
│   │   ├── OffscreenWebViewModule.java
│   │   └── OffscreenWebViewPackage.java
│   └── ios/               # iOS native modules
│       ├── OffscreenWebViewModule.swift
│       └── OffscreenWebViewModule.m
├── examples/               # Usage examples
│   └── ui-webview-example.tsx       # WebView example
├── package.json           # Package configuration
├── tsconfig.json          # TypeScript configuration
└── README.md              # Detailed documentation
```

## 🔗 Related Links

- [React Native WebView](https://github.com/react-native-webview/react-native-webview)
- [WKWebView Documentation](https://developer.apple.com/documentation/webkit/wkwebview)
- [Android WebView Documentation](https://developer.android.com/reference/android/webkit/WebView) 