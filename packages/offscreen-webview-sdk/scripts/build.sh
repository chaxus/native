#!/bin/bash

# Offscreen WebView SDK 构建脚本

set -e

echo "🚀 开始构建 Offscreen WebView SDK..."

# 清理之前的构建
echo "🧹 清理之前的构建..."
npm run clean

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建 TypeScript
echo "🔨 构建 TypeScript..."
npm run build

# 运行测试
echo "🧪 运行测试..."
npm test

# 代码检查
echo "🔍 代码检查..."
npm run lint

# 格式化代码
echo "✨ 格式化代码..."
npm run format

echo "✅ 构建完成！"
echo "📁 构建输出: dist/"
echo "�� 准备发布: npm publish" 