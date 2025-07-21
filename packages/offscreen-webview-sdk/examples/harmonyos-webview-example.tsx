import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import webViewSDK, { createWebView, getWebViewPlatform } from '../src/index';

/**
 * 鸿蒙系统 WebView 使用示例
 */
export default function HarmonyOSWebViewExample() {
  const [webViewInstance, setWebViewInstance] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<string>('');

  useEffect(() => {
    // 检查平台支持
    const currentPlatform = getWebViewPlatform();
    setPlatform(currentPlatform);

    if (!webViewSDK.isSupported()) {
      Alert.alert('不支持', `当前平台 ${currentPlatform} 不支持 WebView`);
      return;
    }

    // 创建 WebView 实例
    const createInstance = async () => {
      try {
        const instance = await createWebView({
          width: 400,
          height: 600,
          url: 'https://www.example.com',
          javaScriptEnabled: true,
          domStorageEnabled: true,
          cacheEnabled: true,
          visible: false,
        });

        setWebViewInstance(instance);
        console.log('鸿蒙 WebView 实例创建成功');
      } catch (error) {
        console.error('创建 WebView 实例失败:', error);
        Alert.alert('错误', '创建 WebView 实例失败');
      }
    };

    createInstance();

    // 清理函数
    return () => {
      if (webViewInstance) {
        webViewInstance.destroy();
      }
    };
  }, []);

  const showWebView = () => {
    if (webViewInstance) {
      webViewInstance.show();
      setIsVisible(true);
    }
  };

  const hideWebView = () => {
    if (webViewInstance) {
      webViewInstance.hide();
      setIsVisible(false);
    }
  };

  const loadUrl = async () => {
    if (webViewInstance) {
      try {
        await webViewInstance.loadUrl('https://www.baidu.com');
        Alert.alert('成功', 'URL 加载成功');
      } catch (error) {
        Alert.alert('错误', 'URL 加载失败');
      }
    }
  };

  const executeJS = async () => {
    if (webViewInstance) {
      try {
        const result = await webViewInstance.executeJavaScript('document.title');
        Alert.alert('JavaScript 执行结果', result);
      } catch (error) {
        Alert.alert('错误', 'JavaScript 执行失败');
      }
    }
  };

  const getPageInfo = async () => {
    if (webViewInstance) {
      try {
        const [title, url] = await Promise.all([
          webViewInstance.getPageTitle(),
          webViewInstance.getCurrentUrl(),
        ]);
        Alert.alert('页面信息', `标题: ${title}\nURL: ${url}`);
      } catch (error) {
        Alert.alert('错误', '获取页面信息失败');
      }
    }
  };

  const reloadPage = async () => {
    if (webViewInstance) {
      try {
        await webViewInstance.reload();
        Alert.alert('成功', '页面刷新成功');
      } catch (error) {
        Alert.alert('错误', '页面刷新失败');
      }
    }
  };

  if (!webViewSDK.isSupported()) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          当前平台 {platform} 不支持 WebView
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>鸿蒙系统 WebView 示例</Text>
      <Text style={styles.platformText}>当前平台: {platform}</Text>
      
      <View style={styles.buttonContainer}>
        <Button
          title={isVisible ? "隐藏 WebView" : "显示 WebView"}
          onPress={isVisible ? hideWebView : showWebView}
        />
        
        <Button
          title="加载百度"
          onPress={loadUrl}
        />
        
        <Button
          title="执行 JavaScript"
          onPress={executeJS}
        />
        
        <Button
          title="获取页面信息"
          onPress={getPageInfo}
        />
        
        <Button
          title="刷新页面"
          onPress={reloadPage}
        />
      </View>

      {/* WebView 组件 */}
      {webViewInstance && webViewInstance.getComponent() && 
        React.createElement(webViewInstance.getComponent(), {}, null)
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  platformText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
    marginTop: 50,
  },
}); 