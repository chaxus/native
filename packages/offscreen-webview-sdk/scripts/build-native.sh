#!/bin/bash

# Offscreen WebView SDK 原生平台构建脚本

set -e

echo "🚀 开始构建 Offscreen WebView SDK 原生版本..."

# 检查参数
PLATFORM=$1
if [ -z "$PLATFORM" ]; then
    echo "用法: $0 [android|ios|all]"
    exit 1
fi

# 构建 TypeScript
echo "📦 构建 TypeScript..."
npm run build

# 根据平台构建
case $PLATFORM in
    "android")
        echo "🤖 构建 Android 版本..."
        cd native/android
        if [ -f "gradlew" ]; then
            ./gradlew assembleRelease
            echo "✅ Android 构建完成: app/build/outputs/aar/app-release.aar"
        else
            echo "❌ 未找到 gradlew，请确保 Android 项目已正确设置"
            exit 1
        fi
        ;;
    "ios")
        echo "🍎 构建 iOS 版本..."
        cd native/ios
        if [ -f "OffscreenWebView.podspec" ]; then
            # 创建 framework
            xcodebuild -project OffscreenWebView.xcodeproj -scheme OffscreenWebView -configuration Release -sdk iphoneos -destination 'generic/platform=iOS' archive -archivePath OffscreenWebView.xcarchive
            xcodebuild -exportArchive -archivePath OffscreenWebView.xcarchive -exportPath ./build -exportOptionsPlist exportOptions.plist
            echo "✅ iOS 构建完成: build/OffscreenWebView.framework"
        else
            echo "❌ 未找到 OffscreenWebView.podspec，请确保 iOS 项目已正确设置"
            exit 1
        fi
        ;;
    "all")
        echo "🌍 构建所有平台..."
        $0 android
        $0 ios
        ;;
    *)
        echo "❌ 不支持的平台: $PLATFORM"
        echo "支持的平台: android, ios, all"
        exit 1
        ;;
esac

echo "🎉 构建完成！" 