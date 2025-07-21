import { createWebView, isWebViewSupported } from '@native/offscreen-webview-sdk';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface InlineWebViewContextType {
  showWebView: () => void;
  hideWebView: () => void;
  isVisible: boolean;
  isLoaded: boolean;
}

const InlineWebViewContext = createContext<InlineWebViewContextType | undefined>(undefined);

export const useInlineWebView = () => {
  const context = useContext(InlineWebViewContext);
  if (!context) {
    throw new Error('useInlineWebView must be used within an InlineWebViewProvider');
  }
  return context;
};

interface InlineWebViewProviderProps {
  children: React.ReactNode;
  url: string;
  visible?: boolean;
  style?: any;
  containerStyle?: any;
  javaScriptEnabled?: boolean;
  domStorageEnabled?: boolean;
  allowsInlineMediaPlayback?: boolean;
  mediaPlaybackRequiresUserAction?: boolean;
  cacheEnabled?: boolean;
  cacheMode?: 'LOAD_DEFAULT' | 'LOAD_CACHE_ELSE_NETWORK' | 'LOAD_NO_CACHE' | 'LOAD_CACHE_ONLY';
  debug?: boolean;
}

export const InlineWebViewProvider: React.FC<InlineWebViewProviderProps> = ({
  children,
  url,
  visible = false,
  style,
  containerStyle,
  javaScriptEnabled = true,
  domStorageEnabled = true,
  allowsInlineMediaPlayback = true,
  mediaPlaybackRequiresUserAction = false,
  cacheEnabled = true,
  cacheMode = 'LOAD_DEFAULT',
  debug = false,
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [isLoaded, setIsLoaded] = useState(false);
  const [webViewInstance, setWebViewInstance] = useState<any>(null);
  const [WebViewComponent, setWebViewComponent] = useState<React.ComponentType<any> | null>(null);
  const [useSDK, setUseSDK] = useState(false);

  useEffect(() => {
    const initWebView = async () => {
      try {
        // 检查是否支持 SDK
        if (isWebViewSupported()) {
          const instance = await createWebView({
            width: 375,
            height: 667,
            url,
            visible: isVisible,
            style,
            containerStyle,
            javaScriptEnabled,
            domStorageEnabled,
            allowsInlineMediaPlayback,
            mediaPlaybackRequiresUserAction,
            cacheEnabled,
            cacheMode,
            debug,
          });

          setWebViewInstance(instance);
          setWebViewComponent(() => instance.getComponent());
          setUseSDK(true);

          // 监听加载状态
          const checkLoaded = setInterval(() => {
            if (instance.isLoaded()) {
              setIsLoaded(true);
              clearInterval(checkLoaded);
            }
          }, 100);
        } else {
          console.log('SDK not supported, using fallback WebView');
          setUseSDK(false);
        }
      } catch (error) {
        console.error('Failed to initialize SDK WebView:', error);
        setUseSDK(false);
      }
    };

    initWebView();
  }, [url]);

  const showWebView = () => {
    setIsVisible(true);
    if (webViewInstance && useSDK) {
      webViewInstance.show();
    }
  };

  const hideWebView = () => {
    setIsVisible(false);
    if (webViewInstance && useSDK) {
      webViewInstance.hide();
    }
  };

  const contextValue: InlineWebViewContextType = {
    showWebView,
    hideWebView,
    isVisible,
    isLoaded,
  };

  return (
    <InlineWebViewContext.Provider value={contextValue}>
      {children}
      
      {/* 使用 SDK WebView */}
      {useSDK && WebViewComponent && (
        <WebViewComponent>
          <View />
        </WebViewComponent>
      )}
      
      {/* 回退到原生 WebView */}
      {!useSDK && isVisible && (
        <View style={[styles.webViewContainer, containerStyle]}>
          <WebView
            source={{ uri: url }}
            style={[styles.webView, style]}
            startInLoadingState={true}
            javaScriptEnabled={javaScriptEnabled}
            domStorageEnabled={domStorageEnabled}
            allowsInlineMediaPlayback={allowsInlineMediaPlayback}
            mediaPlaybackRequiresUserAction={mediaPlaybackRequiresUserAction}
            cacheEnabled={cacheEnabled}
            cacheMode={cacheMode}
            onLoadEnd={() => {
              console.log('WebView loaded:', url);
              setIsLoaded(true);
            }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.warn('WebView error: ', nativeEvent);
            }}
          />
        </View>
      )}
    </InlineWebViewContext.Provider>
  );
};

const styles = StyleSheet.create({
  webViewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 100, // 留出底部 tab 栏的空间
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  webView: {
    flex: 1,
  },
}); 