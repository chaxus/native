import { View, Text, WebView } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Web() {
  useLoad(() => {
    console.log('Web page loaded.')
  })

  return (
    <View className='web'>
      <View className='web-header'>
        <Text className='web-title'>Web 页面</Text>
      </View>
      <View className='web-content'>
        <WebView 
          src='https://www.baidu.com'
          className='web-view'
        />
      </View>
    </View>
  )
}
