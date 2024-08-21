import { TextInput, TextInputProps, TouchableOpacity, ViewStyle } from 'react-native';
import React, { useState } from 'react';
import Color from 'color';
import passwordFiledStyles from './Password.style';
import APP_IMAGES from '../../constants/images';

import Container from './Container';
import { SvgProps } from 'react-native-svg';
import { useAppThemeColor } from '@/hooks/useThemeColor';


interface PasswordProps {
  onChange: (text: string) => void;
  value: string;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  textInputProps?: TextInputProps;
}

const Password: React.FC<PasswordProps> = ({
  onChange,
  value,
  onBlur,
  placeholder = 'mot de passe',
  error,
  textInputProps
}) => {

  const colors = useAppThemeColor();
  const styles = passwordFiledStyles(colors)
  const [showPass, setShowPass] = useState(false);

  return (
    <Container svgStartIcon={APP_IMAGES.ICON_PASSWORD_FIELD as React.FC<SvgProps>} error={error}>
      <TextInput
        style={styles.textInput as any}
        placeholder={placeholder}
        placeholderTextColor={Color(colors.black).alpha(0.5).toString()}
        onChangeText={onChange}
        value={value}
        onBlur={onBlur}
        secureTextEntry={!showPass}
        {...textInputProps}

      />
      <TouchableOpacity onPress={() => setShowPass(!showPass)}>
        {showPass ? (
          <APP_IMAGES.ICON_PASSWORD_SHOWED fillOpacity={0.8} width={32} height={32} />
        ) : (
          <APP_IMAGES.ICON_PASSWORD_UNSHOWED fillOpacity={0.8} width={32} height={32} />
        )}
      </TouchableOpacity>
    </Container>
  );
};

export default Password;
