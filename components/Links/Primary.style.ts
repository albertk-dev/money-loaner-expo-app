import { StyleSheet} from 'react-native';

import linksStyle from './styles';
import { IAppColors } from '@/constants/Colors';


const PrimaryLinkStyle = (colors:IAppColors) =>  StyleSheet.create({
    
 
  text: {
        ...linksStyle.linkbase,
      color:colors.primary,
  }
  
  
  
});
  

export default PrimaryLinkStyle