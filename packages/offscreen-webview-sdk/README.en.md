# Offscreen WebView SDK

[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue.svg)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[English](README.en.md) | [中文](README.md)

A cross-platform offscreen WebView SDK that supports React Native, Android, iOS, and Web platforms. Provides powerful background web page processing capabilities, suitable for webpage screenshots, content scraping, automated testing, and other scenarios.

## 🚀 Features

- ✅ **Cross-Platform Support**: React Native, Android, iOS, Web
- ✅ **Offscreen Rendering**: Runs in background without occupying UI thread
- ✅ **JavaScript Execution**: Execute JavaScript code in WebView
- ✅ **Page Screenshots**: Capture screenshots of WebView content
- ✅ **Page Operations**: Navigation, refresh, content retrieval, etc.
- ✅ **Event Listening**: Support for page loading, error events, etc.
- ✅ **TypeScript Support**: Complete type definitions
- ✅ **Lightweight**: Minimal dependencies, easy to integrate

## 📦 Installation

```bash
npm install @native/offscreen-webview-sdk
# or
yarn add @native/offscreen-webview-sdk
# or
pnpm add @native/offscreen-webview-sdk
```

## 🛠️ Quick Start

### React Native Usage Example

```typescript
import { createOffscreenWebView, isOffscreenWebViewSupported } from '@native/offscreen-webview-sdk';

// Check platform support
if (!isOffscreenWebViewSupported()) {
  console.log('Current platform does not support offscreen WebView');
  return;
}

// Create WebView instance
const webView = await createOffscreenWebView({
  width: 375,
  height: 667,
  url: 'https://example.com',
  javaScriptEnabled: true,
  debug: true
});

// Load page
await webView.loadUrl('https://reactnative.dev');

// Execute JavaScript
const result = await webView.executeJavaScript(`
  document.title = 'Modified by SDK';
  document.title;
`);

// Capture screenshot
const screenshot = await webView.captureScreenshot();

// Get page content
const content = await webView.getPageContent();

// Destroy instance
await webView.destroy();
```

### Complete Example

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
      Alert.alert('Success', 'WebView created successfully');
    } catch (error) {
      Alert.alert('Error', `Creation failed: ${error}`);
    }
  };

  const loadPage = async () => {
    if (!webView) return;
    
    try {
      await webView.loadUrl('https://reactnative.dev');
      const title = await webView.getPageTitle();
      Alert.alert('Page Title', title);
    } catch (error) {
      Alert.alert('Error', `Loading failed: ${error}`);
    }
  };

  const takeScreenshot = async () => {
    if (!webView) return;
    
    try {
      const screenshot = await webView.captureScreenshot();
      // Process screenshot data
      console.log('Screenshot:', screenshot.substring(0, 100));
    } catch (error) {
      Alert.alert('Error', `Screenshot failed: ${error}`);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Button title="Create WebView" onPress={createWebView} />
      <Button title="Load Page" onPress={loadPage} />
      <Button title="Screenshot" onPress={takeScreenshot} />
    </View>
  );
};
```

## 📚 API Documentation

### Configuration Options

```typescript
interface OffscreenWebViewConfig {
  width: number;                    // WebView width
  height: number;                   // WebView height
  url?: string;                     // Initial URL
  html?: string;                    // Initial HTML content
  userAgent?: string;               // User agent string
  javaScriptEnabled?: boolean;      // Enable JavaScript
  allowFileAccess?: boolean;        // Allow file access
  allowUniversalAccessFromFileURLs?: boolean; // Allow universal file access
  headers?: Record<string, string>; // Custom request headers
  injectedJavaScript?: string;      // Injected JavaScript code
  debug?: boolean;                  // Enable debug mode
}
```

### Instance Methods

```typescript
interface OffscreenWebViewInstance {
  // Page loading
  loadUrl(url: string): Promise<void>;
  loadHTML(html: string, baseURL?: string): Promise<void>;
  
  // JavaScript execution
  executeJavaScript(script: string): Promise<any>;
  
  // Page information
  getPageContent(): Promise<string>;
  getPageTitle(): Promise<string>;
  getCurrentUrl(): Promise<string>;
  
  // Screenshots
  captureScreenshot(): Promise<string>;
  
  // Navigation
  goBack(): Promise<boolean>;
  goForward(): Promise<boolean>;
  reload(): Promise<void>;
  stopLoading(): Promise<void>;
  
  // Lifecycle
  destroy(): Promise<void>;
}
```

### SDK Methods

```typescript
// Create instance
const webView = await createOffscreenWebView(config);

// Check support
const supported = isOffscreenWebViewSupported();

// Get platform
const platform = getOffscreenWebViewPlatform();

// Get version
const version = getOffscreenWebViewVersion();
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

Web platform uses hidden iframe implementation, supports all modern browsers.

## 🎯 Use Cases

- **Webpage Screenshots**: Batch generate webpage screenshots
- **Content Scraping**: Scrape webpage content for data analysis
- **Automated Testing**: Run web tests in background
- **Pre-rendering**: Pre-load and render webpage content
- **Data Extraction**: Extract structured data from webpages

## 🚨 Important Notes

1. **Memory Management**: Destroy WebView instances when not needed
2. **Network Permissions**: Ensure app has appropriate network permissions
3. **Cross-Origin Restrictions**: Web platform may be subject to CORS restrictions
4. **Performance Considerations**: Large numbers of instances may affect performance
5. **Platform Differences**: Behavior may vary slightly between platforms

## 🤝 Contributing

Welcome to submit Issues and Pull Requests!

## 📄 License

MIT License

## 🔗 Related Links

- [React Native WebView](https://github.com/react-native-webview/react-native-webview)
- [WKWebView Documentation](https://developer.apple.com/documentation/webkit/wkwebview)
- [Android WebView Documentation](https://developer.android.com/reference/android/webkit/WebView) 