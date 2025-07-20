# 项目文档

欢迎来到项目文档中心！这里包含了项目的所有重要文档和指南。

## 📚 文档目录

### 🚀 快速开始
- [项目启动指南](./start.md) - 如何快速启动和运行项目

### 🔧 开发指南
- [Android 构建问题解决](./android-build-troubleshooting.md) - React Native Android 构建问题完整解决方案
- [Offscreen WebView SDK](./offscreen-webview-sdk.md) - 离屏渲染 WebView SDK 使用指南

### 📱 平台特定指南
- [Android 开发](./android-build-troubleshooting.md) - Android 平台开发和构建指南

## 🛠️ 技术栈

- **React Native**: 0.79.5
- **Expo**: 53.0.19
- **TypeScript**: 5.8.3
- **包管理器**: pnpm

## 📋 环境要求

- **macOS**: 支持 Apple Silicon (M1/M2) 和 Intel
- **Java**: 17 (推荐 Zulu JDK)
- **Android SDK**: 最新版本
- **Node.js**: 18+ 版本

## 🚀 快速命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm start

# 运行 Android 应用
pnpm android

# 运行 iOS 应用
pnpm ios

# 开发模式运行
pnpm dev:android
pnpm dev:ios

# 构建 APK (本地构建，推荐用于测试)
pnpm apk:release

# 构建应用 (EAS 云构建)
pnpm build:android
pnpm build:ios
```

## 📞 支持

如果遇到问题，请：

1. 查看相关文档
2. 检查 [Android 构建问题解决指南](./android-build-troubleshooting.md)
3. 提交 Issue 到项目仓库

---

*最后更新：2024 年 12 月*
