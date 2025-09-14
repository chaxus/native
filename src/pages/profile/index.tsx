import { View, Text, Image } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Profile() {
  useLoad(() => {
    console.log('Profile page loaded.')
  })

  return (
    <View className='profile'>
      <View className='profile-header'>
        <View className='avatar-section'>
          <View className='avatar'>
            <Text className='avatar-text'>头像</Text>
          </View>
          <View className='user-info'>
            <Text className='username'>用户名</Text>
            <Text className='user-desc'>这是个人简介</Text>
          </View>
        </View>
      </View>
      
      <View className='profile-content'>
        <View className='menu-section'>
          <View className='menu-item'>
            <Text className='menu-text'>设置</Text>
            <Text className='menu-arrow'>></Text>
          </View>
          <View className='menu-item'>
            <Text className='menu-text'>关于我们</Text>
            <Text className='menu-arrow'>></Text>
          </View>
          <View className='menu-item'>
            <Text className='menu-text'>帮助与反馈</Text>
            <Text className='menu-arrow'>></Text>
          </View>
        </View>
      </View>
    </View>
  )
}
