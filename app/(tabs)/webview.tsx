import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSharedWebView } from '../../components/SharedWebView';

export default function WebViewScreen() {
  const { showWebView, hideWebView } = useSharedWebView();

  // 当页面显示时显示 WebView
  useEffect(() => {
    showWebView();
    
    // 当页面隐藏时隐藏 WebView
    return () => {
      hideWebView();
    };
  }, [showWebView, hideWebView]);

  return (
    <SafeAreaView style={styles.container}>
      {/* WebView 现在由 SharedWebViewProvider 管理 */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 