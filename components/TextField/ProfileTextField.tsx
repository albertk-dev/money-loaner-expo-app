import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TextInputProps, TextStyle, TouchableOpacity, View } from 'react-native';
import Color from 'color'
import { IAppColors } from '../../constants/Colors';

import { SvgProps } from 'react-native-svg';
import CustomAlert from '../CustomAlert';
import APP_IMAGES from '../../constants/images';
import fonts from '../../constants/fonts';
import { useAppThemeColor } from '@/hooks/useThemeColor';


interface ProfileTextFieldProps {
  textInputProps?: TextInputProps;
  onChange: (text: string) => void;
  label?: string
  onBlur?: () => void;
  canEdit?: boolean;
  value?: string;
  helperText?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  svgStartIcon?: React.FC<SvgProps>;
  startIconProps?: SvgProps;
  svgEndIcon?: React.FC<SvgProps>;
  endIconProps?: SvgProps;
  handleClicEndIcon?: () => void;
}

const ProfileTextField: React.FC<ProfileTextFieldProps> = ({
  textInputProps,
  onChange,
  canEdit = true,
  onBlur,
  value,
  placeholder = 'entrez du texte',
  error,
  svgStartIcon: SvgStartICON,
  startIconProps,
  svgEndIcon: SvgEndICON,
  endIconProps,
  required = false,
  label = 'label',
  helperText,
  handleClicEndIcon
}) => {

  const colors = useAppThemeColor();
  const styles = customStyles(colors)

  const initialStartIconProps = { width: 32, height: 32, fill: colors.primary, fillOpacity: 0 };


  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertTitle, setAlertTitle] = useState('Erreur');

  const showAlert = (message: string, title?: string) => {
    setAlertMessage(message);
    if (title) {
      setAlertTitle(title)
    }
    setAlertVisible(true);
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };



  return (
    <View style={[styles.container, canEdit ? styles.container_editable : styles.container_nonEditable, error != null && styles.container_error, { position: 'relative' }]}>

      <View style={[styles.label_container]}>
        <Text style={[styles.label_text, { color: canEdit ? colors.black : Color(colors.black).alpha(0.5).toString() }]}>{label}</Text>
        {canEdit && required && <Text style={{ color: colors.danger, ...fonts.bodyHighLight } as TextStyle} >{'*'}</Text>}

        <TouchableOpacity onPress={() => Alert.alert(`Aide ${label}`, helperText || "consultez un dictionnaire putain...")}>
          <APP_IMAGES.ICON_HELP_FIELD width={16} height={16} fill={colors.primary} />
        </TouchableOpacity>

      </View>



      <View style={[styles.text_zone, canEdit && { borderBottomColor: colors.black, borderBottomWidth: 1 }]}>

        <View style={[styles.text_zone_start]}>
          {SvgStartICON && <SvgStartICON {...initialStartIconProps} {...startIconProps} />}

          <TextInput
            style={[styles.textInput as TextStyle, canEdit && { backgroundColor: colors.white }]}
            placeholder={placeholder}
            placeholderTextColor={Color(colors.black).alpha(0.5).toString()}
            onChangeText={onChange}
            value={value}
            onBlur={onBlur}
            editable={canEdit}



            {...textInputProps}
          />
        </View>


        {SvgEndICON && handleClicEndIcon &&
          <TouchableOpacity onPress={handleClicEndIcon}>
            <SvgEndICON {...initialStartIconProps} {...endIconProps} />
          </TouchableOpacity>}
      </View>



      {/* On error */}

      {error && (
        <TouchableOpacity
          onPress={() => showAlert(error)}
          style={styles.alert_button}
        >
          <APP_IMAGES.ICON_ALERT width={16} height={16} />
        </TouchableOpacity>
      )}
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={closeAlert}
        type='error'
      />
    </View>
  );
};

export default ProfileTextField;



const customStyles = (colors: IAppColors) => StyleSheet.create({
  container: {
    width: '100%',
    gap: 5,
    paddingLeft: 2,
    justifyContent: 'space-between',
    borderRadius: 4,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    height: 'auto'
  },
  container_editable: {
    borderBottomColor: colors.black,
    borderBottomWidth: 0,
    backgroundColor: Color(colors.white).alpha(0.5).toString(),
  },
  container_nonEditable: {
    backgroundColor: colors.background,
  },
  container_error: {
    borderWidth: 1,
    borderColor: colors.danger,
  },
  label_container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 5,
    alignItems: 'center',
  },
  label_text: {
    ...fonts.bodyHighLight as TextStyle,
  },

  label_icon: {
    width: 16,
    height: 16,
  },
  text_zone: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text_zone_icon: {
    width: 32,
    height: 32,
  },
  text_zone_start: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    gap: 10,
    height: 40,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 'auto',
    padding:5,
    ...fonts.bodyHighLight,


  },
  alert_button: {
    backgroundColor: colors.danger,
    position: 'absolute',
    right: 0,
    top: 0,
    borderBottomLeftRadius: 4,
    borderTopRightRadius: 4,
  }
})