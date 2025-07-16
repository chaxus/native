import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface SharedWebViewContextType {
  isPreloaded: boolean;
  preloadProgress: number;
  showWebView: () => void;
  hideWebView: () => void;
  isVisible: boolean;
}

const SharedWebViewContext = createContext<SharedWebViewContextType | undefined>(undefined);

interface SharedWebViewProviderProps {
  children: React.ReactNode;
  uri: string;
}

export function SharedWebViewProvider({ children, uri }: SharedWebViewProviderProps) {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldPreload, setShouldPreload] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const showWebView = () => {
    setIsVisible(true);
  };

  const hideWebView = () => {
    setIsVisible(false);
  };

  const handlePreloadComplete = async () => {
    setIsPreloaded(true);
    setPreloadProgress(100);
    console.log('SharedWebView preload completed for:', uri);
    
    // 保存预加载状态
    try {
      await AsyncStorage.setItem('webview_preloaded', 'true');
      await AsyncStorage.setItem('webview_preload_time', Date.now().toString());
      await AsyncStorage.setItem('webview_preload_uri', uri);
    } catch (error) {
      console.warn('Failed to save preload state:', error);
    }
  };

  const handlePreloadError = (error: any) => {
    console.warn('SharedWebView preload failed:', error);
    setIsPreloaded(true); // 即使失败也标记为完成
  };

  // 检查是否有已保存的预加载状态
  useEffect(() => {
    const checkPreloadState = async () => {
      try {
        const preloaded = await AsyncStorage.getItem('webview_preloaded');
        const preloadTime = await AsyncStorage.getItem('webview_preload_time');
        const preloadUri = await AsyncStorage.getItem('webview_preload_uri');
        
        if (preloaded === 'true' && preloadUri === uri) {
          const timeDiff = Date.now() - parseInt(preloadTime || '0');
          // 如果预加载时间在 1 小时内，认为缓存仍然有效
          if (timeDiff < 3600000) {
            setIsPreloaded(true);
            setPreloadProgress(100);
            console.log('Using cached preload state');
            return;
          }
        }
      } catch (error) {
        console.warn('Failed to check preload state:', error);
      }
    };
    
    checkPreloadState();
  }, [uri]);

  // 自动开始预加载
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isPreloaded) {
        setShouldPreload(true);
      }
    }, 1000); // 延迟 1 秒开始预加载

    return () => clearTimeout(timer);
  }, [isPreloaded]);

  // 模拟预加载进度
  useEffect(() => {
    if (shouldPreload && !isPreloaded) {
      const interval = setInterval(() => {
        setPreloadProgress(prev => {
          if (prev < 90) {
            return prev + 10;
          }
          return prev;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [shouldPreload, isPreloaded]);

  return (
    <SharedWebViewContext.Provider
      value={{
        isPreloaded,
        preloadProgress,
        showWebView,
        hideWebView,
        isVisible,
      }}
    >
      {children}
      
      {/* 后台预加载的 WebView */}
      {shouldPreload && !isVisible && (
        <View style={styles.hiddenContainer}>
          <WebView
            ref={webViewRef}
            source={{ uri }}
            style={styles.hiddenWebView}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            cacheEnabled={true}
            cacheMode="LOAD_DEFAULT"
            onLoadEnd={handlePreloadComplete}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              handlePreloadError(nativeEvent);
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('SharedWebView received error status code: ', nativeEvent.statusCode);
            }}
          />
        </View>
      )}

      {/* 可见的 WebView */}
      {isVisible && (
        <View style={styles.visibleContainer}>
          {!isPreloaded && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>
                预加载中... {preloadProgress}%
              </Text>
            </View>
          )}
          {isPreloaded && (
            <Text style={styles.cacheText}>
              ✅ 使用预加载缓存
            </Text>
          )}
          <WebView
            source={{ uri }}
            style={[styles.visibleWebView, !isPreloaded && styles.hidden]}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            cacheEnabled={true}
            cacheMode="LOAD_DEFAULT"
            onLoadEnd={() => {
              console.log('Visible WebView loaded');
            }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('Visible WebView error: ', nativeEvent);
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('Visible WebView received error status code: ', nativeEvent.statusCode);
            }}
          />
        </View>
      )}
    </SharedWebViewContext.Provider>
  );
}

export function useSharedWebView() {
  const context = useContext(SharedWebViewContext);
  if (context === undefined) {
    throw new Error('useSharedWebView must be used within a SharedWebViewProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  hiddenContainer: {
    position: 'absolute',
    top: -10000,
    left: -10000,
    width: 1,
    height: 1,
  },
  hiddenWebView: {
    width: 1,
    height: 1,
    opacity: 0,
  },
  visibleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  visibleWebView: {
    flex: 1,
  },
  hidden: {
    opacity: 0,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  cacheText: {
    position: 'absolute',
    top: 50,
    right: 20,
    fontSize: 12,
    color: '#4CAF50',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 5,
    borderRadius: 4,
    zIndex: 2,
  },
}); 