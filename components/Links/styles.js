import fonts from "@/constants/fonts";
import { StyleSheet } from "react-native";


const linksStyle = StyleSheet.create(
    {
        linkbase: {
            textDecorationLine: 'underline',
            ...fonts.bodymin,
        
    }
    }
)

export default linksStyle;