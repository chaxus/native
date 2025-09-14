import { View, Text, WebView } from '@tarojs/components'
import { useLoad, useDidShow, useDidHide } from '@tarojs/taro'
import { useTabStore } from '../../store/tabStore'
import { useState } from 'react'
import './index.scss'

export default function Web() {
  const { setCurrentTab } = useTabStore()
  const [showWebView, setShowWebView] = useState(true) // 初始就显示 WebView

  useLoad(() => {
    console.log('Web page loaded.')
    setCurrentTab('web')
  })

  useDidShow(() => {
    console.log('Web page shown - showing WebView')
    setShowWebView(true)
  })

  // 移除 useDidHide，让 WebView 保持加载状态
  // useDidHide(() => {
  //   console.log('Web page hidden - hiding WebView')
  //   setShowWebView(false)
  // })

  return (
    <View className='web'>
      {showWebView ? (
        <WebView 
          src="https://chaxus.github.io/ran/"
          className='webview-content'
          onLoad={() => {
            console.log('WebView loaded: https://chaxus.github.io/ran/')
          }}
          onError={(e) => {
            console.error('WebView error:', e)
          }}
        />
      ) : (
        <View className='web-placeholder'>
          <Text className='placeholder-text'>正在预加载 WebView...</Text>
          <Text className='placeholder-desc'>请稍候，WebView 即将显示</Text>
        </View>
      )}
    </View>
  )
}
