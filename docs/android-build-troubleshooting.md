# React Native Android 构建问题解决总结

## 概述

本文档总结了在 macOS 环境下配置和构建 React Native Android 应用时遇到的常见问题及其解决方案。

## 遇到的问题及解决方案

### 1. **Android SDK 路径未配置**

**问题表现：**
```
SDK location not found. Define a valid SDK location with an ANDROID_HOME environment variable
```

**解决方案：**
1. **设置环境变量**：
   ```bash
   echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
   echo 'export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools' >> ~/.zshrc
   source ~/.zshrc
   ```

2. **创建 local.properties 文件**：
   ```properties
   # android/local.properties
   sdk.dir=/Users/ranzhouhang/Library/Android/sdk
   ```

### 2. **Java 版本兼容性问题**

**问题表现：**
```
BUG! exception in phase 'semantic analysis' in source unit '_BuildScript_' Unsupported class file major version 68
```

**解决方案：**
1. **检查 Java 版本**：
   ```bash
   java -version
   /usr/libexec/java_home -V
   ```

2. **切换到 Java 17**：
   ```bash
   export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
   export PATH=$JAVA_HOME/bin:$PATH
   ```

3. **在 gradle.properties 中配置**：
   ```properties
   org.gradle.java.home=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
   ```

### 3. **NDK 版本配置问题**

**问题表现：**
```
NDK at /Users/ranzhouhang/Library/Android/sdk/ndk/27.1.12297006 did not have a source.properties file
```

**解决方案：**
1. **检查可用 NDK 版本**：
   ```bash
   ls -la ~/Library/Android/sdk/ndk/
   ```

2. **配置正确的 NDK 版本**：
   ```properties
   # android/gradle.properties
   ndkVersion=29.0.13599879
   ```

### 4. **react-native-reanimated 兼容性问题**

**问题表现：**
```
Could not create an instance of type org.gradle.api.reporting.internal.DefaultReportContainer.
> Type T not present
```

**解决方案：**
1. **降级到兼容版本**：
   ```bash
   pnpm add react-native-reanimated@3.16.1
   ```

2. **清理并重新构建**：
   ```bash
   cd android && ./gradlew clean
   cd .. && pnpm android
   ```

### 5. **Gradle 警告优化**

**问题表现：**
```
WARNING: A restricted method in java.lang.System has been called
```

**解决方案：**
在 `android/gradle.properties` 中添加：
```properties
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m --enable-native-access=ALL-UNNAMED
```

## 最终配置文件

### `android/local.properties`
```properties
## This file must *NOT* be checked into Version Control Systems,
# as it contains information specific to your local configuration.
#
# Location of the SDK. This is only used by Gradle.
# For customization when using a Version Control System, please read the
# header note.
sdk.dir=/Users/ranzhouhang/Library/Android/sdk
```

### `android/gradle.properties`
```properties
# Project-wide Gradle settings.
org.gradle.jvmargs=-Xmx2048m -XX:MaxMetaspaceSize=512m --enable-native-access=ALL-UNNAMED

# AndroidX package structure
android.useAndroidX=true
android.enablePngCrunchInReleaseBuilds=true

# React Native architectures
reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64

# New architecture
newArchEnabled=true
hermesEnabled=true

# Expo configurations
expo.gif.enabled=true
expo.webp.enabled=true
expo.webp.animated=false
EX_DEV_CLIENT_NETWORK_INSPECTOR=true
expo.useLegacyPackaging=false
expo.edgeToEdgeEnabled=true

# NDK version
ndkVersion=29.0.13599879
```

## 关键命令总结

```bash
# 设置 Java 环境
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH

# 清理构建缓存
pnpm apk:clean

# 构建并运行 Android 应用
pnpm android

# 开发模式运行
pnpm dev:android

# 构建 APK 文件
pnpm apk:debug      # 构建调试版本 APK
pnpm apk:release    # 构建发布版本 APK (推荐用于测试)

# EAS 云构建
pnpm build:android  # 构建开发版本
```

## 环境要求

- **macOS**: 支持 Apple Silicon (M1/M2) 和 Intel
- **Java**: 17 (推荐 Zulu JDK)
- **Android SDK**: 最新版本
- **NDK**: 29.0.13599879 或兼容版本
- **Gradle**: 8.13
- **React Native**: 0.79.5
- **Expo**: 53.0.19

## 预防措施

1. **定期检查 Java 版本兼容性**
2. **保持 Android SDK 和 NDK 版本更新**
3. **注意依赖库版本兼容性**
4. **使用稳定的 Gradle 版本**
5. **定期清理构建缓存**

## 常见错误排查

### 检查环境配置
```bash
# 检查 Java 版本
java -version

# 检查 Android SDK 路径
echo $ANDROID_HOME

# 检查 NDK 版本
ls -la $ANDROID_HOME/ndk/
```

### 清理和重置
```bash
# 清理 Gradle 缓存
cd android && ./gradlew clean

# 清理 node_modules
rm -rf node_modules && pnpm install

# 清理 Metro 缓存
pnpm start --reset-cache
```

## 相关链接

- [React Native 官方文档](https://reactnative.dev/docs/environment-setup)
- [Expo 开发文档](https://docs.expo.dev/)
- [Android Studio 下载](https://developer.android.com/studio)
- [Java 版本兼容性](https://docs.gradle.org/current/userguide/compatibility.html)

---

*最后更新：2024 年 12 月* 