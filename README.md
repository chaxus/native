# Native App - Cross-Platform Mobile Application

[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.19-blue.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[English](README.md) | [中文](README.zh-CN.md)

A modern cross-platform mobile application built with React Native and Expo, featuring advanced WebView capabilities and comprehensive development tools.

## 🌟 Features

- **🚀 Cross-Platform**: Runs on Android, iOS, and Web
- **📱 Modern UI**: Built with React Native and Expo Router
- **🔧 TypeScript**: Full TypeScript support for better development experience
- **🌐 Advanced WebView**: Custom offscreen WebView SDK for background processing
- **📦 Monorepo**: Organized with workspace packages
- **🛠️ Development Tools**: Comprehensive build and development scripts
- **📚 Documentation**: Complete documentation and troubleshooting guides

## 📦 Packages

This project includes several packages:

- **Main App**: React Native application with Expo
- **Offscreen WebView SDK**: Cross-platform WebView solution for background processing
  - Supports Android, iOS, and Web platforms
  - Enables webpage screenshot, content scraping, and automation
  - Full TypeScript support with comprehensive API

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18+ version
- **Java**: 17 (推荐 Zulu JDK)
- **Android SDK**: 最新版本
- **Android NDK**: 29.0.13599879 或兼容版本
- **Xcode**: For iOS development (macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd native
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm start
   ```

## 📱 Development Commands

### Run on Devices/Simulators
```bash
# Run on Android
pnpm android

# Run on iOS
pnpm ios

# Run on Web
pnpm web

# Development mode with dev client
pnpm dev:android
pnpm dev:ios
pnpm dev:web
```

### Build APK Files

#### Local APK Build (Recommended for Testing)

```bash
# Build Debug APK (开发调试版本)
pnpm apk:debug

# Build Release APK (正式发布版本，推荐用于测试分发)
pnpm apk:release

# Clean build cache
pnpm apk:clean
```

**APK 文件位置：**
- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release APK: `android/app/build/outputs/apk/release/app-release.apk`

#### EAS Cloud Build

```bash
# Build development version
pnpm build:android

# Build preview version
pnpm build:android:preview

# Build production version
pnpm build:android:production
```

### Build iOS

```bash
# Build development version
pnpm build:ios

# Build preview version
pnpm build:ios:preview

# Build production version
pnpm build:ios:production
```

## 🔧 Environment Setup

### Java Environment
确保使用 Java 17：
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH
```

### Android SDK Configuration
确保 `android/local.properties` 文件包含正确的 SDK 路径：
```properties
sdk.dir=/Users/ranzhouhang/Library/Android/sdk
```

## 📚 Documentation

- [项目文档](./docs/index.md) - 完整的项目文档
- [Android 构建问题解决](./docs/android-build-troubleshooting.md) - 常见问题解决方案
- [Offscreen WebView SDK 使用指南](./docs/offscreen-webview-sdk.md) - SDK 详细使用说明

## 🛠️ Troubleshooting

如果遇到构建问题，请参考：
- [Android 构建问题解决指南](./docs/android-build-troubleshooting.md)
- 确保 Java 版本为 17
- 检查 Android SDK 和 NDK 配置

## 🏗️ Project Structure

```
native/
├── app/                           # Main application (Expo Router)
├── packages/                      # Workspace packages
│   └── offscreen-webview-sdk/    # Offscreen WebView SDK
├── android/                       # Android native code
├── ios/                          # iOS native code
├── docs/                         # Documentation
├── components/                   # Shared components
├── constants/                    # App constants
└── assets/                       # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)

## 📞 Support

If you encounter any issues or have questions:

1. Check the [documentation](./docs/)
2. Search existing [issues](../../issues)
3. Create a new issue with detailed information

---

**Made with ❤️ using React Native and Expo**
