import { StyleSheet} from 'react-native';


import { IAppColors } from '../../constants/Colors';
import buttonsStyle from './styles';


const ContainerButtonStyle = (colors:IAppColors) => StyleSheet.create({
    
  block: {
      ...buttonsStyle.buttonBase,
     
        borderColor: colors.primary,
      
      width: 200,
    height: 'auto',
    

      
  }
  
  
  
});
  

export default ContainerButtonStyle