import { StyleSheet, TextStyle} from 'react-native';


import { IAppColors } from '../../constants/Colors';
import buttonsStyle from './styles';
import fonts from '@/constants/fonts';


const PreviousButtonStyle = (colors:IAppColors) =>  StyleSheet.create({
    
  block: {
      ...buttonsStyle.buttonBase,
     
      borderColor: colors.black,
      width: 200,
    height: 'auto',
    paddingVertical:5
    

      
  },
  text: {
    color: colors.text,
    ...fonts.bodyHighLight,
  }as TextStyle
  
  
  
});
  

export default PreviousButtonStyle