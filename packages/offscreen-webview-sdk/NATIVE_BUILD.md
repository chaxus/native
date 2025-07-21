# 原生平台构建指南

本指南介绍如何将 `offscreen-webview-sdk` 打包成 Android 和 iOS 原生平台可直接使用的版本。

## 📦 支持的平台

- ✅ **Android**: AAR 库文件
- ✅ **iOS**: Framework 文件
- ✅ **React Native**: NPM 包
- ✅ **Web**: JavaScript 模块

## 🚀 快速开始

### 1. 构建所有平台

```bash
# 构建 TypeScript + Android + iOS
npm run build:all

# 或者使用脚本
./scripts/build-native.sh all
```

### 2. 构建特定平台

```bash
# 只构建 Android
npm run build:android
./scripts/build-native.sh android

# 只构建 iOS
npm run build:ios
./scripts/build-native.sh ios
```

### 3. 创建发布包

```bash
# 创建 NPM 包
npm run pack

# 发布到 NPM
npm run publish
./scripts/publish.sh
```

## 🤖 Android 构建

### 构建产物

构建完成后，Android 版本将生成：

```
native/android/app/build/outputs/aar/app-release.aar
```

### 在 Android 项目中使用

1. **添加 AAR 文件**：
   ```gradle
   // app/build.gradle
   dependencies {
       implementation files('libs/offscreen-webview-sdk-release.aar')
   }
   ```

2. **添加依赖**：
   ```gradle
   dependencies {
       implementation "com.facebook.react:react-native:0.72.0"
       implementation "com.facebook.react:react-native-webview:13.6.0"
   }
   ```

3. **在代码中使用**：
   ```java
   import com.chaxus.nativeapp.OffscreenWebViewModule;
   
   // 创建 WebView 实例
   OffscreenWebViewModule webView = new OffscreenWebViewModule();
   ```

## 🍎 iOS 构建

### 构建产物

构建完成后，iOS 版本将生成：

```
native/ios/build/OffscreenWebView.framework
```

### 在 iOS 项目中使用

1. **添加 Framework**：
   - 将 `OffscreenWebView.framework` 拖拽到 Xcode 项目中
   - 确保 "Copy items if needed" 已勾选

2. **添加依赖**：
   ```ruby
   # Podfile
   pod 'React-Core'
   pod 'react-native-webview'
   ```

3. **在代码中使用**：
   ```swift
   import OffscreenWebView
   
   // 创建 WebView 实例
   let webView = OffscreenWebViewModule()
   ```

## 📋 构建要求

### Android 要求

- Android SDK 34+
- Gradle 8.0+
- Kotlin 1.8+
- React Native 0.72+

### iOS 要求

- Xcode 14+
- iOS 12.0+
- React Native 0.72+

## 🔧 自定义构建

### 修改 Android 配置

编辑 `native/android/app/build.gradle`：

```gradle
android {
    compileSdkVersion 34
    buildToolsVersion "34.0.0"
    
    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 34
        // 自定义配置...
    }
}
```

### 修改 iOS 配置

编辑 `native/ios/OffscreenWebView.podspec`：

```ruby
Pod::Spec.new do |s|
  s.platform = :ios, "12.0"
  # 自定义配置...
end
```

## 📦 发布流程

### 1. 准备发布

```bash
# 检查代码状态
git status

# 运行测试
npm test

# 构建所有版本
npm run build:all
```

### 2. 发布到 NPM

```bash
# 使用发布脚本
./scripts/publish.sh

# 或手动发布
npm version patch  # 或 minor/major
npm publish
```

### 3. 创建 Git 标签

```bash
git tag "v1.0.0"
git push origin "v1.0.0"
```

## 🐛 故障排除

### Android 构建问题

1. **Gradle 版本不匹配**：
   ```bash
   # 更新 Gradle Wrapper
   cd native/android
   ./gradlew wrapper --gradle-version 8.0
   ```

2. **SDK 版本问题**：
   ```bash
   # 检查 SDK 版本
   sdkmanager --list
   ```

### iOS 构建问题

1. **Xcode 版本问题**：
   ```bash
   # 检查 Xcode 版本
   xcodebuild -version
   ```

2. **证书问题**：
   ```bash
   # 检查证书
   security find-identity -v -p codesigning
   ```

## 📚 更多资源

- [React Native 原生模块开发指南](https://reactnative.dev/docs/native-modules-intro)
- [Android AAR 库开发](https://developer.android.com/studio/projects/android-library)
- [iOS Framework 开发](https://developer.apple.com/library/archive/documentation/MacOSX/Conceptual/BPFrameworks/) 