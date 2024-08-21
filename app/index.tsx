
import fonts from '@/constants/fonts'
import APP_IMAGES from '@/constants/images'
import { useAppThemeColor } from '@/hooks/useThemeColor'
import commonStyles from '@/styles/common'
import { router } from 'expo-router'
import React, { useEffect } from 'react'
import { ActivityIndicator, SafeAreaView, Text, TextStyle, View } from 'react-native'


export default function LoadingScreen() {
    const colors = useAppThemeColor()
    const styles = commonStyles(colors)
    

useEffect(()=>{
    setTimeout(()=>{
        router.push("/choose_entity")
    },5000)
})
    
  return (
    <SafeAreaView style={[styles.page, styles.flexCenter, {gap:30}]}>
       <View style={{ justifyContent: 'center', alignItems: 'center', gap: 5 }}>
          <APP_IMAGES.LOGO width={100} height={100} />
        <Text style={{ ...fonts.title, color: colors.primary } as TextStyle}>Money Loaner</Text>
      </View>
      <ActivityIndicator size={'large'} color={colors.primary} />
    </SafeAreaView>
  )
}
