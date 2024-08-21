import { View, Text, TouchableOpacity, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import React from 'react';
import PrimaryButtonStyle from './Primary.style';
import { useAppThemeColor } from '@/hooks/useThemeColor';



interface PrimaryProps {
  onPress: () => void;
  title?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

const Primary: React.FC<PrimaryProps> = ({ onPress, title = 'Continuer', disabled = false, isLoading = false }) => {

const colors = useAppThemeColor()
const style = PrimaryButtonStyle(colors);
  const finalStyle: ViewStyle = disabled ? { ...style.block, opacity: 0.5 } : style.block;

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={{...finalStyle, backgroundColor: isLoading? colors.text: colors.primary}}>
      {!isLoading ? <Text style={style.text as TextStyle}>{title}</Text> : 
      <ActivityIndicator color={colors.primary} size={'small'}/>}
    </TouchableOpacity>
  );
};

export default Primary;
