import { StyleSheet, TextStyle} from 'react-native';


import buttonsStyle from './styles';
import { IAppColors } from '@/constants/Colors';
import fonts from '@/constants/fonts';


const PrimaryButtonStyle = (colors:IAppColors)=> StyleSheet.create({
    
  block: {
      ...buttonsStyle.buttonBase,
     
        borderColor: colors.primary,
      backgroundColor:colors.primary,
      width: 200,
    height: 'auto',
    

      
  },
  text: {
    color: colors.white,
    ...fonts.title,
  }as TextStyle
  
  
  
});
  

export default PrimaryButtonStyle