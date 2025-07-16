import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useInlineWebView } from '../../components/InlineWebView';

export default function WebViewScreen() {
  const { showWebView, hideWebView, isLoaded } = useInlineWebView();

  // 使用 useFocusEffect 来监听页面焦点变化
  useFocusEffect(
    React.useCallback(() => {
      // 页面获得焦点时显示 WebView
      showWebView();
      // 页面失去焦点时隐藏 WebView
      return () => {
        hideWebView();
      };
    }, [showWebView, hideWebView])
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* WebView 现在由 InlineWebViewProvider 管理 */}
      {!isLoaded && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>正在加载...</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
}); 