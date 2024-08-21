import React from 'react';
import { TextInput, TextInputProps, TextStyle } from 'react-native';
import Color from 'color'
import Container from './Container';
import ContainedTextStyles from './ContainedDefault.style';
import { SvgProps } from 'react-native-svg';
import { useAppThemeColor } from '@/hooks/useThemeColor';



interface ContainedDefaultProps {
  textInputProps?: TextInputProps;
  onChange: (text: string) => void;
  onBlur?: () => void;
  value: string;
  placeholder?: string;
  error?: string;
  svgStartIcon?: React.FC<SvgProps>;
  startIconProps?: any; // Replace 'any' with a more specific type if possible
}

const ContainedDefault: React.FC<ContainedDefaultProps> = ({
  textInputProps,
  onChange,
  onBlur,
  value,
  placeholder = 'entrez du texte',
  error = '',
  svgStartIcon,
  startIconProps,
}) => {
  const colors = useAppThemeColor()
  const styles = ContainedTextStyles(colors);
  return (
    <Container svgStartIcon={svgStartIcon} iconProps={startIconProps} error={error}>
      <TextInput
        style={styles.textInput as TextStyle} // TypeScript fix for StyleSheet issues
        placeholder={placeholder}
        placeholderTextColor={Color(colors.black).alpha(0.5).toString()}
        onChangeText={onChange}
        value={value}
        onBlur={onBlur}
        {...textInputProps}
      />
    </Container>
  );
};

export default ContainedDefault;
