# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 18+ version
- **Java**: 17 (推荐 Zulu JDK)
- **Android SDK**: 最新版本
- **Android NDK**: 29.0.13599879 或兼容版本

### Installation

1. Install dependencies

   ```bash
   pnpm install
   ```

2. Start the app

   ```bash
   pnpm start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

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

## 🛠️ Troubleshooting

如果遇到构建问题，请参考：
- [Android 构建问题解决指南](./docs/android-build-troubleshooting.md)
- 确保 Java 版本为 17
- 检查 Android SDK 和 NDK 配置

## Get a fresh project

When you're ready, run:

```bash
pnpm reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
