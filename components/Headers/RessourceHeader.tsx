import { IAppColors } from "@/constants/Colors"
import fonts from "@/constants/fonts";
import APP_IMAGES from "@/constants/images";
import { router } from "expo-router";
import React from "react"
import {  Text, TextStyle, TouchableOpacity, View } from "react-native";

type Props = {
    appName: string,
    colors:IAppColors,
}

const  RessourceHeader:React.FC<Props> = ({ appName, colors}) => {

    return (
        <View style={{ display: 'flex',marginTop:20, flexDirection: 'row', padding: 10, height: 64, justifyContent: 'space-between', gap: 5, alignItems: 'center' }}>
          <TouchableOpacity onPress={()=>router.back()}>
                 <APP_IMAGES.ARROW_BACK_ICON width={32} height={32}  fill={colors.primary}/>
          </TouchableOpacity>
   
          <Text
            style={{ ...fonts.title, color: colors.primary } as TextStyle}
          >
            {appName}
          </Text>
        <APP_IMAGES.LOGO width={32} height={32}/>  
      </View>

    )

}

export default RessourceHeader;