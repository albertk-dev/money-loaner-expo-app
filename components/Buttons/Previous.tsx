import { Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import React from 'react';
import PreviousButtonStyle from './previous.style';
import APP_IMAGES from '../../constants/images';
import { useAppThemeColor } from '@/hooks/useThemeColor';



interface PreviousProps {
  title?: string;
  onPress: () => void;
}

const Previous: React.FC<PreviousProps> = ({ title = 'Précédent', onPress }) => {

  const colors = useAppThemeColor()
  const style = PreviousButtonStyle(colors);

  return (
    <TouchableOpacity onPress={onPress} style={style.block as ViewStyle}>
      <APP_IMAGES.ICON_CHEVRON_BACK width={32} height={32} />
      <Text style={style.text as TextStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Previous;
