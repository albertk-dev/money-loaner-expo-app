import { Text, TouchableOpacity, ViewStyle, ImageSourcePropType } from 'react-native';
import React from 'react';
import ChooseEntityStyle from './chooseEntity.style';
import { useAppThemeColor } from '@/hooks/useThemeColor';



interface ChooseEntityProps {
  image: React.ComponentType<any>;
  entityTitle: string;
  description: string;
  onPress: () => void;
}

const ChooseEntity: React.FC<ChooseEntityProps> = ({ image: Image, entityTitle, description, onPress }) => {

  const colors = useAppThemeColor()
  const style = ChooseEntityStyle(colors);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={style.buttonBlock as ViewStyle} // Cast style to ViewStyle
      activeOpacity={0.5}
    >
      <Image width={64} height={64} />
      <Text style={style.buttonTitle}>{entityTitle}</Text>
      <Text style={style.buttonText}>{description}</Text>
    </TouchableOpacity>
  );
};

export default ChooseEntity;
