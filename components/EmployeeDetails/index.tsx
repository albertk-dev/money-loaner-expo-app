import Color from 'color';
import React from 'react';
import { Modal, View, Text, Button, StyleSheet, ScrollView, TouchableWithoutFeedback, TextStyle, ViewStyle, Image, TouchableOpacity } from 'react-native';
import  { IAppColors } from '../../constants/Colors';
import { IEmployee } from 'money-loaner-api-types';
import APP_IMAGES from '../../constants/images';
import fonts from '../../constants/fonts';
import { useAppThemeColor } from '@/hooks/useThemeColor';




interface EmployeeDetailsProps {
  visible:boolean,
  employee: IEmployee,
  onUpdate: (data: IEmployee) => void,
  onDelete?: (data: IEmployee) => void,
  onPause?: (data: IEmployee) => void,
  onClose: ()=>void,
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ visible, employee, onUpdate, onDelete, onPause, onClose }) => {
  const colors = useAppThemeColor()
  const styles = customstyles(colors)
  if (!employee) {
    return <Text>'nada'</Text>
  }
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='fade'
      onRequestClose={()=>onClose()}
    >
     
        <View style={styles.modalBackground}>
        <View style={{ ...styles.modalContainer } as ViewStyle}>
          <TouchableOpacity onPress={()=>onClose()} style={{width:'100%', justifyContent:'flex-end', alignItems:'flex-start', marginBottom:5}}><APP_IMAGES.ICON_CLOSE_MENU width={32} height={32} fill={Color(colors.black).alpha(0.5).toString()}/></TouchableOpacity>
          <Text style={styles.title}>{`Employé [${employee?.inCompanyId}]`}</Text>
          <View style={{justifyContent:'center', alignItems:'center'}}>
                {employee.photoURL != null && employee.photoURL != 'none' ? <Image source={{ uri: employee?.photoURL }} style={{ borderRadius: 100, marginBottom:5 }} width={100} height={100} /> :
                  <View style={{ borderRadius: 100, padding: 0, height: 100, width: 100, marginBottom:5 }} ><APP_IMAGES.ICON_FIELD_EMPTY_EMPLOYEE height={48} width={48} fill={colors.background} /></View>}
              </View>
            <ScrollView style={styles.scrollView} contentContainerStyle={{gap:10}}>
              
              <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection:'row',gap:5, width:'100%' }}>
              <Text >Nom</Text>
                <Text style={{...fonts.bodyHighLight} as TextStyle}>{employee.name}</Text>
            </View>
            
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection:'row',gap:5, width:'100%' }}>
              <Text >Poste</Text>
                <Text style={{...fonts.bodyHighLight} as TextStyle}>{employee.job}</Text>
            </View>
            
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection:'row',gap:5, width:'100%' }}>
              <Text >Salaire</Text>
                <Text style={{...fonts.bodyHighLight} as TextStyle}>{employee.salary}</Text>
            </View>

            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection:'row',gap:5, width:'100%' }}>
              <Text >Ajouté le </Text>
                <Text style={{...fonts.bodymin, color:colors.text} as TextStyle}>{`${new Date(employee.createdAt as Date).toLocaleDateString('fr-FR')} à ${new Date(employee.createdAt as Date).toLocaleTimeString('fr-FR')}`}</Text>
            </View>

            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection:'row',gap:5, width:'100%' }}>
              <Text >Email</Text>
                <Text style={{...fonts.bodymin, color:colors.text} as TextStyle}>{employee.email}</Text>
              </View>
            
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection:'row',gap:5, width:'100%' }}>
              <Text >Téléphone</Text>
                <Text style={{...fonts.bodyHighLight} as TextStyle}>{employee.phoneNumber}</Text>
              </View>
              
              <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection:'row',gap:5, width:'100%', marginTop:10 }}>
              <TouchableOpacity disabled><APP_IMAGES.ICON_DELETE_FOREVER width={32} height={32} fill={'gray'} /></TouchableOpacity>
              <TouchableOpacity onPress={()=>onUpdate(employee)}><APP_IMAGES.ICON_EDIT_EMPLOYEE_IN_DETAILS width={32} height={32} fill={colors.primary} /></TouchableOpacity>
              <TouchableOpacity disabled><APP_IMAGES.ICON_SUSPEND_EMPLOYEE width={32} height={32} fill={'gray'} /></TouchableOpacity>
              </View>
              
            </ScrollView>
          </View>
        </View>
  
    </Modal>
  );
};

const customstyles = (colors:IAppColors) => StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color(colors.primary).alpha(0.5).toString(),

  },
  modalContainer: {
    width: '80%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 4,
    padding: 10,
    paddingBottom:0,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  scrollView: {
    maxHeight: 700,
    marginBottom: 5,
  },
  message: {
    fontSize: 16,
    color: 'black',
  },
});

export default EmployeeDetails;
