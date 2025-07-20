# Native App - 跨平台移动应用

[![React Native](https://img.shields.io/badge/React%20Native-0.79.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-53.0.19-blue.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[English](README.md) | [中文](README.zh-CN.md)

一个基于 React Native 和 Expo 构建的现代跨平台移动应用，具有先进的 WebView 功能和全面的开发工具。

## 🌟 功能特性

- **🚀 跨平台支持**: 支持 Android、iOS 和 Web 平台
- **📱 现代界面**: 基于 React Native 和 Expo Router 构建
- **🔧 TypeScript**: 完整的 TypeScript 支持，提供更好的开发体验
- **🌐 高级 WebView**: 自定义离屏 WebView SDK，支持后台处理
- **📦 单体仓库**: 使用 workspace 包进行组织管理
- **🛠️ 开发工具**: 全面的构建和开发脚本
- **📚 完整文档**: 详细的文档和故障排除指南

## 📦 包含的包

本项目包含多个包：

- **主应用**: 基于 Expo 的 React Native 应用
- **离屏 WebView SDK**: 跨平台 WebView 解决方案，支持后台处理
  - 支持 Android、iOS 和 Web 平台
  - 支持网页截图、内容抓取和自动化
  - 完整的 TypeScript 支持和全面的 API

## 🚀 快速开始

### 环境要求

- **Node.js**: 18+ 版本
- **Java**: 17 (推荐 Zulu JDK)
- **Android SDK**: 最新版本
- **Android NDK**: 29.0.13599879 或兼容版本
- **Xcode**: iOS 开发需要 (仅 macOS)

### 安装步骤

1. **克隆仓库**
   ```bash
   git clone <repository-url>
   cd native
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **启动开发服务器**
   ```bash
   pnpm start
   ```

## 📱 开发命令

### 在设备/模拟器上运行
```bash
# 在 Android 上运行
pnpm android

# 在 iOS 上运行
pnpm ios

# 在 Web 上运行
pnpm web

# 开发模式 (使用开发客户端)
pnpm dev:android
pnpm dev:ios
pnpm dev:web
```

### 构建 APK 文件

#### 本地 APK 构建 (推荐用于测试)

```bash
# 构建调试版本 APK
pnpm apk:debug

# 构建发布版本 APK (推荐用于测试分发)
pnpm apk:release

# 清理构建缓存
pnpm apk:clean
```

**APK 文件位置：**
- 调试版本: `android/app/build/outputs/apk/debug/app-debug.apk`
- 发布版本: `android/app/build/outputs/apk/release/app-release.apk`

#### EAS 云构建

```bash
# 构建开发版本
pnpm build:android

# 构建预览版本
pnpm build:android:preview

# 构建生产版本
pnpm build:android:production
```

### 构建 iOS

```bash
# 构建开发版本
pnpm build:ios

# 构建预览版本
pnpm build:ios:preview

# 构建生产版本
pnpm build:ios:production
```

## 🔧 环境配置

### Java 环境
确保使用 Java 17：
```bash
export JAVA_HOME=/Library/Java/JavaVirtualMachines/zulu-17.jdk/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH
```

### Android SDK 配置
确保 `android/local.properties` 文件包含正确的 SDK 路径：
```properties
sdk.dir=/Users/ranzhouhang/Library/Android/sdk
```

## 📚 文档

- [项目文档](./docs/index.md) - 完整的项目文档
- [Android 构建问题解决](./docs/android-build-troubleshooting.md) - 常见问题解决方案
- [离屏 WebView SDK 使用指南](./docs/offscreen-webview-sdk.md) - SDK 详细使用说明

## 🛠️ 故障排除

如果遇到构建问题，请参考：
- [Android 构建问题解决指南](./docs/android-build-troubleshooting.md)
- 确保 Java 版本为 17
- 检查 Android SDK 和 NDK 配置

## 🏗️ 项目结构

```
native/
├── app/                           # 主应用 (Expo Router)
├── packages/                      # Workspace 包
│   └── offscreen-webview-sdk/    # 离屏 WebView SDK
├── android/                       # Android 原生代码
├── ios/                          # iOS 原生代码
├── docs/                         # 文档
├── components/                   # 共享组件
├── constants/                    # 应用常量
└── assets/                       # 静态资源
```

## 🎯 使用场景

### 离屏 WebView SDK 应用场景

- **网页截图**: 批量生成网页截图
- **内容抓取**: 抓取网页内容进行数据分析
- **自动化测试**: 在后台运行网页测试
- **预渲染**: 预加载和渲染网页内容
- **数据提取**: 从网页中提取结构化数据

## 🤝 贡献

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m '添加一些很棒的功能'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [Expo 文档](https://docs.expo.dev/)
- [React Native 文档](https://reactnative.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)

## 📞 支持

如果您遇到任何问题或有疑问：

1. 查看 [文档](./docs/)
2. 搜索现有 [issues](../../issues)
3. 创建包含详细信息的新 issue

---

**使用 React Native 和 Expo 构建 ❤️** 