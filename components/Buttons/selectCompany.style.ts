import { StyleSheet, TextStyle} from 'react-native';

import fonts from '../../constants/fonts';
import { IAppColors } from '../../constants/Colors';
import buttonsStyle from './styles';


const SelectCompanyStyle = (colors:IAppColors) => StyleSheet.create({
    
    buttonBlock: {

        ...buttonsStyle.buttonBase,
     
      borderColor: colors.primary,
    
      
    },
    block: {
        display:'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        
        
    },
  text: {
    color: colors.black,
    ...fonts.bodyHighLight,
  } as TextStyle
  
  
  
});
  

export default SelectCompanyStyle