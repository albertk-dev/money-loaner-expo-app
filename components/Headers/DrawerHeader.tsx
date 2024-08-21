import { IAppColors } from "@/constants/Colors"
import fonts from "@/constants/fonts";
import APP_IMAGES from "@/constants/images";
import { Ionicons } from "@expo/vector-icons";
import { DrawerHeaderProps } from "@react-navigation/drawer"
import { router } from "expo-router";
import { ICompany } from "money-loaner-api-types";
import React from "react"
import { Image, Text, TextStyle, TouchableOpacity, View } from "react-native";

type Props = {
    drawerHeaderProps: DrawerHeaderProps,
    appName: string,
   company: ICompany,
    onClicRight:()=>void,
    colors:IAppColors,
}

const  DrawerHeader:React.FC<Props> = ({drawerHeaderProps, appName, company, onClicRight, colors}) => {

    return (
        <View
        style={{
          marginTop: 10,
          width: "100%",
          alignItems: "center",
          height: "auto",
          justifyContent: "space-between",
          flexDirection: "row",
          padding: 20,
        }}
      >
           <TouchableOpacity onPress={() => drawerHeaderProps.navigation.openDrawer()}>
            <Ionicons name="menu" size={32} color={colors.text} />
          </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 5,
          }}
        >

          <APP_IMAGES.LOGO width={32} height={32} />
          <Text
            style={{ ...fonts.title, color: colors.primary } as TextStyle}
          >
            {appName}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onClicRight}
          style={{ borderStartColor: colors.white, borderRadius: 100 }}
        >
          {company ? (
            <Image
              source={{ uri: company?.logoURL }}
              width={48}
              height={48}
              style={{ borderRadius: 100 }}
            />
          ) : (
            <View
              style={{
                height: 48,
                width: 48,
                borderRadius: 100,
                backgroundColor: colors.secondary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              ML
            </View>
          )}
        </TouchableOpacity>
      </View>

    )

}

export default DrawerHeader;