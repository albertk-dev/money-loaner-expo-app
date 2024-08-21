import { StyleSheet, TextStyle} from 'react-native';


import { IAppColors } from '../../constants/Colors';
import fonts from '@/constants/fonts';


const ChooseEntityStyle = (colors:IAppColors) => StyleSheet.create({
    
    buttonBlock: {
      padding: 10,
      display:"flex",
      gap: 10,
      borderColor: colors.primary,
      borderWidth:1,
      borderRadius: 4,
      width: 138,
      height:'100%',
      flexDirection: "column",
      alignItems: "center",
    },
    buttonImage: {
      width: 64,
      height:64,
    },
    buttonTitle: {
      ...fonts.bodyHighLight,
      color: 'black',
      textAlign:'center',
  
    } as TextStyle,
    buttonText: {
      ...fonts.bodymin,
      color: 'black',
      textAlign:'center',
    } as TextStyle,
  
});
  

export default ChooseEntityStyle