import { Text, TouchableOpacity, ViewStyle } from 'react-native';
import React, { ReactNode } from 'react';
import ContainerButtonStyle from './Container.style';
import { useAppThemeColor } from '@/hooks/useThemeColor';

interface ContainerProps {
  children: ReactNode;
  onPress: () => void;
  disabled?: boolean;
}

const Container: React.FC<ContainerProps> = ({ children, onPress, disabled = false }) => {
const colors = useAppThemeColor()

const style = ContainerButtonStyle(colors);


  const finalStyle: ViewStyle = disabled ? { ...style.block, opacity: 0.5 } : style.block;

  return (
    <TouchableOpacity disabled={disabled} onPress={onPress} style={finalStyle}>
      {children}
    </TouchableOpacity>
  );
};

export default Container;
