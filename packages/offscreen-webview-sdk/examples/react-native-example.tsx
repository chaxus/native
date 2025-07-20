import React, { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, Text, View } from 'react-native';
import {
    createOffscreenWebView,
    getOffscreenWebViewPlatform,
    isOffscreenWebViewSupported
} from '../src';

const OffscreenWebViewExample: React.FC = () => {
  const [webViewInstance, setWebViewInstance] = useState<any>(null);
  const [pageTitle, setPageTitle] = useState<string>('');
  const [currentUrl, setCurrentUrl] = useState<string>('');
  const [screenshot, setScreenshot] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    checkSupport();
  }, []);

  /**
   * 检查平台支持
   */
  const checkSupport = () => {
    const supported = isOffscreenWebViewSupported();
    const platform = getOffscreenWebViewPlatform();
    
    console.log(`Platform: ${platform}, Supported: ${supported}`);
    
    if (!supported) {
      Alert.alert('不支持', `当前平台 ${platform} 不支持离屏 WebView`);
    }
  };

  /**
   * 创建 WebView 实例
   */
  const createInstance = async () => {
    try {
      setIsLoading(true);
      
      const instance = await createOffscreenWebView({
        width: 375,
        height: 667,
        url: 'https://example.com',
        javaScriptEnabled: true,
        debug: true,
        userAgent: 'OffscreenWebView/1.0',
        injectedJavaScript: `
          console.log('Offscreen WebView initialized');
          window.ReactNativeWebView = {
            postMessage: (data) => {
              console.log('Message from WebView:', data);
            }
          };
        `
      });

      setWebViewInstance(instance);
      Alert.alert('成功', 'WebView 实例创建成功');
      
      // 获取页面信息
      updatePageInfo(instance);
      
    } catch (error) {
      Alert.alert('错误', `创建实例失败: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 更新页面信息
   */
  const updatePageInfo = async (instance: any) => {
    try {
      const title = await instance.getPageTitle();
      const url = await instance.getCurrentUrl();
      
      setPageTitle(title);
      setCurrentUrl(url);
    } catch (error) {
      console.error('Failed to update page info:', error);
    }
  };

  /**
   * 加载 URL
   */
  const loadUrl = async () => {
    if (!webViewInstance) {
      Alert.alert('错误', '请先创建 WebView 实例');
      return;
    }

    try {
      setIsLoading(true);
      await webViewInstance.loadUrl('https://reactnative.dev');
      await updatePageInfo(webViewInstance);
      Alert.alert('成功', '页面加载完成');
    } catch (error) {
      Alert.alert('错误', `加载页面失败: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 执行 JavaScript
   */
  const executeJavaScript = async () => {
    if (!webViewInstance) {
      Alert.alert('错误', '请先创建 WebView 实例');
      return;
    }

    try {
      const result = await webViewInstance.executeJavaScript(`
        document.title = 'Modified by Offscreen WebView';
        document.title;
      `);
      
      setPageTitle(result);
      Alert.alert('成功', `JavaScript 执行结果: ${result}`);
    } catch (error) {
      Alert.alert('错误', `执行 JavaScript 失败: ${error}`);
    }
  };

  /**
   * 获取页面截图
   */
  const captureScreenshot = async () => {
    if (!webViewInstance) {
      Alert.alert('错误', '请先创建 WebView 实例');
      return;
    }

    try {
      setIsLoading(true);
      const screenshotData = await webViewInstance.captureScreenshot();
      setScreenshot(screenshotData);
      Alert.alert('成功', '截图已生成');
    } catch (error) {
      Alert.alert('错误', `截图失败: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 获取页面内容
   */
  const getPageContent = async () => {
    if (!webViewInstance) {
      Alert.alert('错误', '请先创建 WebView 实例');
      return;
    }

    try {
      const content = await webViewInstance.getPageContent();
      Alert.alert('页面内容', content.substring(0, 200) + '...');
    } catch (error) {
      Alert.alert('错误', `获取页面内容失败: ${error}`);
    }
  };

  /**
   * 销毁实例
   */
  const destroyInstance = async () => {
    if (!webViewInstance) {
      Alert.alert('错误', '没有可销毁的实例');
      return;
    }

    try {
      await webViewInstance.destroy();
      setWebViewInstance(null);
      setPageTitle('');
      setCurrentUrl('');
      setScreenshot('');
      Alert.alert('成功', 'WebView 实例已销毁');
    } catch (error) {
      Alert.alert('错误', `销毁实例失败: ${error}`);
    }
  };

  return (
    <ScrollView style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        离屏 WebView SDK 示例
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 10 }}>
        平台: {getOffscreenWebViewPlatform()}
      </Text>
      
      <Text style={{ fontSize: 16, marginBottom: 20 }}>
        支持状态: {isOffscreenWebViewSupported() ? '✅ 支持' : '❌ 不支持'}
      </Text>

      <View style={{ marginBottom: 20 }}>
        <Button
          title={webViewInstance ? "重新创建实例" : "创建 WebView 实例"}
          onPress={createInstance}
          disabled={isLoading}
        />
      </View>

      {webViewInstance && (
        <>
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>页面标题: {pageTitle}</Text>
          </View>
          
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>当前 URL: {currentUrl}</Text>
          </View>

          <View style={{ marginBottom: 10 }}>
            <Button
              title="加载 React Native 官网"
              onPress={loadUrl}
              disabled={isLoading}
            />
          </View>

          <View style={{ marginBottom: 10 }}>
            <Button
              title="执行 JavaScript"
              onPress={executeJavaScript}
              disabled={isLoading}
            />
          </View>

          <View style={{ marginBottom: 10 }}>
            <Button
              title="获取页面截图"
              onPress={captureScreenshot}
              disabled={isLoading}
            />
          </View>

          <View style={{ marginBottom: 10 }}>
            <Button
              title="获取页面内容"
              onPress={getPageContent}
              disabled={isLoading}
            />
          </View>

          <View style={{ marginBottom: 20 }}>
            <Button
              title="销毁实例"
              onPress={destroyInstance}
              disabled={isLoading}
              color="red"
            />
          </View>

          {screenshot && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
                截图预览:
              </Text>
              <Text style={{ fontSize: 12, color: 'gray' }}>
                {screenshot.substring(0, 100)}...
              </Text>
            </View>
          )}
        </>
      )}

      {isLoading && (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          加载中...
        </Text>
      )}
    </ScrollView>
  );
};

export default OffscreenWebViewExample; 