import { createWebView, isWebViewSupported } from '@native/offscreen-webview-sdk';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

const WebViewExample = () => {
  const [webViewInstance, setWebViewInstance] = useState<any>(null);
  const [WebViewComponent, setWebViewComponent] = useState<React.ComponentType<any> | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [pageTitle, setPageTitle] = useState('');

  useEffect(() => {
    const initWebView = async () => {
      try {
        // 检查平台支持
        if (!isWebViewSupported()) {
          Alert.alert('不支持', '当前平台不支持 WebView');
          return;
        }

        // 创建 WebView 实例
        const instance = await createWebView({
          width: 375,
          height: 667,
          url: 'https://reactnative.dev',
          visible: false,
          javaScriptEnabled: true,
          domStorageEnabled: true,
          allowsInlineMediaPlayback: true,
          mediaPlaybackRequiresUserAction: false,
          cacheEnabled: true,
          cacheMode: 'LOAD_DEFAULT',
          debug: true
        });

        setWebViewInstance(instance);
        setWebViewComponent(() => instance.getComponent());

        // 监听加载状态
        const checkLoaded = setInterval(() => {
          if (instance.isLoaded()) {
            setIsLoaded(true);
            clearInterval(checkLoaded);
          }
        }, 100);

      } catch (error) {
        Alert.alert('错误', `创建 WebView 失败: ${error}`);
      }
    };

    initWebView();
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

  const getPageTitle = async () => {
    if (!webViewInstance) return;

    try {
      const title = await webViewInstance.getPageTitle();
      setPageTitle(title);
      Alert.alert('页面标题', title);
    } catch (error) {
      Alert.alert('错误', `获取标题失败: ${error}`);
    }
  };

  const executeJavaScript = async () => {
    if (!webViewInstance) return;

    try {
      const result = await webViewInstance.executeJavaScript(`
        document.title = 'Modified by SDK - ' + new Date().toLocaleTimeString();
        document.title;
      `);
      Alert.alert('JavaScript 执行结果', result);
    } catch (error) {
      Alert.alert('错误', `执行 JavaScript 失败: ${error}`);
    }
  };

  const loadNewUrl = async () => {
    if (!webViewInstance) return;

    try {
      await webViewInstance.loadUrl('https://github.com');
      Alert.alert('成功', '页面已加载到 GitHub');
    } catch (error) {
      Alert.alert('错误', `加载页面失败: ${error}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WebView 示例</Text>
      
      <View style={styles.buttonContainer}>
        <Button title="显示 WebView" onPress={showWebView} />
        <Button title="隐藏 WebView" onPress={hideWebView} />
        <Button title="获取页面标题" onPress={getPageTitle} />
        <Button title="执行 JavaScript" onPress={executeJavaScript} />
        <Button title="加载新页面" onPress={loadNewUrl} />
      </View>

      <View style={styles.statusContainer}>
        <Text>WebView 状态: {isVisible ? '显示' : '隐藏'}</Text>
        <Text>加载状态: {isLoaded ? '已加载' : '加载中'}</Text>
        {pageTitle && <Text>页面标题: {pageTitle}</Text>}
      </View>

      {/* WebView 组件 */}
      {WebViewComponent && (
        <WebViewComponent>
          <View />
        </WebViewComponent>
      )}
    </View>
  );
};

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
    marginBottom: 20,
  },
  buttonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
});

export default WebViewExample; 