import React, { createContext, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

interface InlineWebViewContextType {
  showWebView: () => void;
  hideWebView: () => void;
  isVisible: boolean;
  isLoaded: boolean;
}

const InlineWebViewContext = createContext<InlineWebViewContextType | undefined>(undefined);

interface InlineWebViewProviderProps {
  children: React.ReactNode;
  url: string;
}

export function InlineWebViewProvider({ children, url }: InlineWebViewProviderProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const showWebView = () => {
    setIsVisible(true);
  };

  const hideWebView = () => {
    setIsVisible(false);
  };

  return (
    <InlineWebViewContext.Provider
      value={{
        showWebView,
        hideWebView,
        isVisible,
        isLoaded,
      }}
    >
      {children}
      
      {/* WebView 始终存在，通过样式控制显示/隐藏 */}
      <View style={[styles.webViewContainer, !isVisible && styles.hidden]}>
        <WebView
          source={{ uri: url }}
          style={styles.webView}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          cacheEnabled={true}
          cacheMode="LOAD_DEFAULT"
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
    </InlineWebViewContext.Provider>
  );
}

export function useInlineWebView() {
  const context = useContext(InlineWebViewContext);
  if (context === undefined) {
    throw new Error('useInlineWebView must be used within an InlineWebViewProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  webViewContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 100, // 留出底部tab栏的空间
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  webView: {
    flex: 1,
  },
  hidden: {
    opacity: 0, // 使用opacity而不是display:none，确保WebView继续运行
    pointerEvents: 'none', // 禁用交互
  },
}); 