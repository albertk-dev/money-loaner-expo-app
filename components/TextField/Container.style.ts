import { StyleSheet } from "react-native";
import Color from 'color'
import { IAppColors } from "../../constants/Colors";


const containerTextFieldStyle =(colors: IAppColors)=> StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 10,
        paddingVertical:0,
        height: 'auto',
        alignItems: 'center',
        borderColor: Color(colors.primary).alpha(0.5).toString()

    },

});

export default containerTextFieldStyle