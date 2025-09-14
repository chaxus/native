import { View, Text, Image } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import { useTabStore } from '../../store/tabStore'
import './index.scss'

export default function Index () {
  const { setCurrentTab } = useTabStore()

  useLoad(() => {
    console.log('Index page loaded.')
    setCurrentTab('index')
  })

  return (
    <View className='index'>
      <View className='index-header'>
        <Text className='welcome-text'>欢迎使用 Taro Harmony</Text>
        <Text className='subtitle'>基于 Taro 4.1.6 构建的跨平台应用</Text>
      </View>
      
      <View className='index-content'>
        <View className='feature-card'>
          <View className='card-icon'>🏠</View>
          <Text className='card-title'>首页</Text>
          <Text className='card-desc'>这是应用的主页面</Text>
        </View>
        
        <View className='feature-card'>
          <View className='card-icon'>🌐</View>
          <Text className='card-title'>Web</Text>
          <Text className='card-desc'>内置网页浏览器</Text>
        </View>
        
        <View className='feature-card'>
          <View className='card-icon'>👤</View>
          <Text className='card-title'>我的</Text>
          <Text className='card-desc'>个人中心页面</Text>
        </View>
      </View>
    </View>
  )
}
