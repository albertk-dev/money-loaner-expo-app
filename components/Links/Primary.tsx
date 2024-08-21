import { Text, TouchableOpacity, TextStyle, ViewStyle } from 'react-native';
import React from 'react';
import PrimaryLinkStyle from './Primary.style';
import { useAppThemeColor } from '@/hooks/useThemeColor';



interface PrimaryProps {
  onPress: () => void;
  title?: string;
  disabled?: boolean;
}

const Primary: React.FC<PrimaryProps> = ({ onPress, title = 'Ajoutez-le ici', disabled = false }) => {

  const colors = useAppThemeColor()
  const styles = PrimaryLinkStyle(colors);

  const finalStyle: TextStyle = disabled ? { ...styles.text, opacity: 0.5 } as any : styles.text;

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress}>
      <Text style={finalStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Primary;
