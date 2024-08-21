import Color from 'color';
import React from 'react';
import { Modal, View, Text, Button, StyleSheet, ScrollView, TouchableWithoutFeedback, TextStyle, ViewStyle } from 'react-native';
import  { IAppColors } from '../../constants/Colors';
import { useAppThemeColor } from '@/hooks/useThemeColor';



export type AlertType = 'info' | 'succes' | 'error' | 'warning';
interface CustomAlertProps {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  type: AlertType;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ visible, title = 'Money Loaner', message, onClose, type}) => {
  const colors = useAppThemeColor()
  const styles = customstyles(colors)
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='fade'
    >
      <TouchableWithoutFeedback>
        <View style={styles.modalBackground}>
          <View style={{...styles.modalContainer,backgroundColor:type==='info'&& colors.primary || colors.white} as ViewStyle}>
            <Text style={styles.title}>{title}</Text>
            <ScrollView style={styles.scrollView}>
              <Text style={styles.message}>{message}</Text>
            </ScrollView>
            <Button title="OK" onPress={onClose} />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const customstyles = (colors:IAppColors) =>  StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color(colors.secondary).alpha(0.5).toString(),
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  scrollView: {
    maxHeight: 200,
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: 'black',
  },
});

export default CustomAlert;
