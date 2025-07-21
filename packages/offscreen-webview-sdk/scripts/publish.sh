#!/bin/bash

# Offscreen WebView SDK 发布脚本

set -e

echo "🚀 开始发布 Offscreen WebView SDK..."

# 检查是否在正确的分支
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
    echo "⚠️  警告: 当前不在主分支 ($CURRENT_BRANCH)"
    read -p "是否继续? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 检查是否有未提交的更改
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ 有未提交的更改，请先提交或暂存"
    git status --short
    exit 1
fi

# 构建所有版本
echo "📦 构建所有版本..."
npm run build:all

# 运行测试
echo "🧪 运行测试..."
npm test

# 检查版本号
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📋 当前版本: $CURRENT_VERSION"

# 询问是否要更新版本
read -p "是否要更新版本号? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "选择版本类型:"
    echo "1) patch (1.0.0 -> 1.0.1)"
    echo "2) minor (1.0.0 -> 1.1.0)"
    echo "3) major (1.0.0 -> 2.0.0)"
    read -p "选择 (1-3): " -n 1 -r
    echo
    case $REPLY in
        1) npm version patch ;;
        2) npm version minor ;;
        3) npm version major ;;
        *) echo "❌ 无效选择"; exit 1 ;;
    esac
    NEW_VERSION=$(node -p "require('./package.json').version")
    echo "✅ 版本已更新到: $NEW_VERSION"
fi

# 创建发布包
echo "📦 创建发布包..."
npm pack

# 显示包信息
PACKAGE_NAME=$(node -p "require('./package.json').name")
PACKAGE_VERSION=$(node -p "require('./package.json').version")
PACKAGE_FILE="${PACKAGE_NAME}-${PACKAGE_VERSION}.tgz"

echo "📋 包信息:"
echo "  名称: $PACKAGE_NAME"
echo "  版本: $PACKAGE_VERSION"
echo "  文件: $PACKAGE_FILE"

# 询问是否发布到 npm
read -p "是否发布到 npm? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 发布到 npm..."
    npm publish
    echo "✅ 发布成功！"
    
    # 创建 Git 标签
    echo "🏷️  创建 Git 标签..."
    git tag "v$PACKAGE_VERSION"
    git push origin "v$PACKAGE_VERSION"
    echo "✅ 标签已创建并推送"
else
    echo "📦 包已创建但未发布: $PACKAGE_FILE"
fi

echo "🎉 发布流程完成！" 