import { Alert, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import containerTextFieldStyle from './Container.style';
import  { Colors } from '../../constants/Colors';
import APP_IMAGES from '../../constants/images';
import CustomAlert, { AlertType } from '../CustomAlert';
import { SvgProps } from 'react-native-svg';
import { useAppThemeColor } from '@/hooks/useThemeColor';


const initialStartIconProps = { width: 24, height: 24, fill: Colors.light.primary, fillOpacity: 0 };
interface ContainerProps {
  children: React.ReactNode;
  error?: string;
  svgStartIcon?: React.FC<SvgProps>;
  iconProps?: typeof initialStartIconProps;
  type?: AlertType;
}

const Container: React.FC<ContainerProps> = ({
  children,
  error,
  svgStartIcon: SvgStartICON,
  iconProps = initialStartIconProps,
  type='error'
}) => {
  const colors = useAppThemeColor();
  const styles = containerTextFieldStyle(colors);


  const finalStyle = error ? { ...styles.container, borderColor: colors.danger } : styles.container;

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };

  return (
    <View style={{ ...finalStyle, position: 'relative' }}>
      {SvgStartICON && <SvgStartICON {...initialStartIconProps} {...iconProps} />}
      {children}
      {error && (
        <TouchableOpacity
          onPress={() => showAlert(error)}
          style={{
            backgroundColor: colors.danger,
            position: 'absolute',
            right: 0,
            top: 0,
            borderBottomLeftRadius: 4,
            borderTopRightRadius: 4,
          }}
        >
          <APP_IMAGES.ICON_ALERT width={16} height={16} />
        </TouchableOpacity>
      )}
      <CustomAlert
        visible={alertVisible}
        title="Erreur de Validation"
        message={alertMessage}
        onClose={closeAlert}
        type={type}
      />
    </View>
  );
};

export default Container;
