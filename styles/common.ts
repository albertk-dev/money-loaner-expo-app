import { IAppColors } from "@/constants/Colors";
import fonts from "@/constants/fonts";
import { StyleSheet, TextStyle } from "react-native";

export default function commonStyles(colors:IAppColors) {
    const CommonStyle = StyleSheet.create({
        page: {
          flex: 1,
          backgroundColor: colors.background,
          color: 'black',
          paddingHorizontal: 15,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 15,
        },
        Headerblock: {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: 245,
          gap: 20,
        },
        HeaderText: {
          ...fonts.header,
          color: colors.primary,
        } as TextStyle,
        HeaderLogo: {
          width: 48,
          height: 54,
        },
        buttonBlock: {
          padding: 10,
          display: 'flex',
          gap: 10,
          borderColor: colors.primary,
          borderWidth: 1,
          borderRadius: 4,
          width: 138,
          height: '100%',
          flexDirection: 'column',
          alignItems: 'center',
        },
        buttonImage: {
          width: 64,
          height: 64,
        },
        buttonTitle: {
          ...fonts.bodyHighLight,
          color: 'black',
          textAlign: 'center',
        } as TextStyle,
        buttonText: {
          ...fonts.bodymin,
          color: 'black',
          textAlign: 'center',
        },
        bouttonZone: {
          display: 'flex',
          flexDirection: 'row',
          width: 320,
          height: 175,
          justifyContent: 'space-between',
        },
        flexCenter: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
      });
      return CommonStyle
}