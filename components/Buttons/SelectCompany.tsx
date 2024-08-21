import { View, Text, TouchableOpacity, Image, ImageSourcePropType, ViewStyle, TextStyle } from 'react-native';
import React from 'react';
import SelectCompanyStyle from './selectCompany.style';
import APP_IMAGES from '../../constants/images';
import { useAppThemeColor } from '@/hooks/useThemeColor';



interface SelectCompanyProps {
  enterpriseLogoURL?: string;
  enterpriseName?: string;
  onPress: () => void;
}

const SelectCompany: React.FC<SelectCompanyProps> = ({ enterpriseLogoURL, enterpriseName = "sélectionnez votre entreprise", onPress }) => {

const colors = useAppThemeColor()
const styles = SelectCompanyStyle(colors);

  return (
    <View style={styles.block as ViewStyle}>
      <View style={{display: 'flex',flexDirection:'row', justifyContent: 'flex-start', padding: 10, gap: 10, height: 'auto', width: 'auto', minWidth:200 }}>
        {enterpriseLogoURL && <Image source={{ uri: enterpriseLogoURL }} height={32} width={32} />}
        <Text style={styles.text as TextStyle}>{enterpriseName}</Text>
      </View>

      <TouchableOpacity onPress={onPress} style={styles.buttonBlock as ViewStyle}>
        <APP_IMAGES.EMOJI_PEN width={32} height={32} />
      </TouchableOpacity>
    </View>
  );
}

export default SelectCompany;
