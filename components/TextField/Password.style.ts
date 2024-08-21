import { StyleSheet } from "react-native";
import { IAppColors } from "../../constants/Colors";
import fonts from "../../constants/fonts";

const passwordFiledStyles =(colors: IAppColors)=> StyleSheet.create({
    
    textInput: {
       
        color: colors.primary,
        ...fonts.bodyHighLight,
        height:'100%',
        
        flex: 1
    },

});

export default passwordFiledStyles