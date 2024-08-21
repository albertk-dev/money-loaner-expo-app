import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, Dimensions, Image, Alert, TouchableHighlight, TextStyle } from 'react-native';
import MoreMenu, { MoreMenuItem } from './MoreMenu';
import { IEmployee } from 'money-loaner-api-types';
import  { IAppColors } from '../../constants/Colors';
import APP_IMAGES from '../../constants/images';
import fonts from '../../constants/fonts';
import Color from 'color';
import { useAppThemeColor } from '@/hooks/useThemeColor';


type EmployeeItemProps = {
  employee: IEmployee;
    menuItems: MoreMenuItem<IEmployee>[];
 
  readyToSelect?: boolean;
  onSelect: (selected: boolean, data:IEmployee) => void;
};

const EmployeeItem: React.FC<EmployeeItemProps> = ({ employee,menuItems,  readyToSelect = false, onSelect }) => {

  const colors = useAppThemeColor()
  const styles = customStyles(colors)

  
        const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [selected,setSelected] = useState(false)
        const employeeItemRef = useRef<TouchableOpacity>(null);
        const windowHeight = Dimensions.get('window').height;
      
        const toggleMenu = () => {
          setIsMenuVisible(!isMenuVisible);
        };
      
        const handleMenuPosition = () => {
          if (employeeItemRef.current) {
            employeeItemRef.current.measureInWindow((x, y, width, height) => {
              const topPosition = y > windowHeight / 2 ? y - height : y + height;
              setMenuPosition({ top: topPosition, left: x });
            });
          }
        };
      
  const adaptedMenu:MoreMenuItem<IEmployee>[] = [ {
    text: selected? 'Désélectionner':'Sélectionner',
    onClick: (data: IEmployee) => {
      onSelect(!selected, data)
      setSelected(!selected)
    },
    available:true,
    
  },...menuItems]
    
      
        return (
          <View  style={styles.container}>
            {readyToSelect &&
              <TouchableHighlight onPress={()=>{    onSelect(!selected, employee)
                setSelected(!selected)}} style={{padding:1,  borderRadius: 100, borderWidth: 2, borderColor: colors.primary }}>
              <View style={{ height: 10, width: 10, backgroundColor: selected ? colors.primary : colors.white, borderRadius: 100,  }} />

              </TouchableHighlight>
              
                }
            {employee.photoURL != null && employee.photoURL != 'none' ? <Image source={{ uri: employee.photoURL }} style={{ borderRadius: 100 }} width={48} height={48} /> :
              <View style={{borderRadius:100, padding:0, height:48, width:48}} ><APP_IMAGES.ICON_FIELD_EMPTY_EMPLOYEE height={48} width={48} fill={colors.background}  /></View> }
                <TouchableOpacity delayLongPress={200} onLongPress={() => {
            onSelect(!selected, employee)
      setSelected(!selected)
            }} style={{flex:1,}}>
                
                    <Text style={styles.name}>{employee.name}</Text>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={styles.position as TextStyle}>{employee.job}</Text>
                        <Text> | </Text>
                        <Text style={styles.name}>{employee.salary}</Text>
                    </View>
             
              </TouchableOpacity>
                
           
            <TouchableOpacity onPress={toggleMenu} ref={employeeItemRef} style={{padding:5}}>
              <Text style={styles.moreIcon}>⋮</Text>
            </TouchableOpacity>
            <Modal
              visible={isMenuVisible}
              transparent={true}
              animationType="fade"
              //onRequestClose={() => setIsMenuVisible(false)}
              onShow={handleMenuPosition} // Measure la position du EmployeeItem à chaque ouverture du menu
            >
              <TouchableWithoutFeedback onPress={() => setIsMenuVisible(false)}>
                <View style={styles.modalContainer}>
                  <View style={[styles.modalContent, { top: menuPosition.top, left: menuPosition.left }]}>
                    <MoreMenu data={employee} items={adaptedMenu} onClose={() => setIsMenuVisible(false)} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        );
      };
  
  const customStyles = (colors: IAppColors) => StyleSheet.create({
    container: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      flexDirection: 'row',
      alignItems: 'center',
          justifyContent: 'space-between',
      gap:10,
    },
    name: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    position: {
      ...fonts.bodymin,
      color: Color(colors.text).alpha(0.5).toString(),
    },
    moreIcon: {
      fontSize: 24,
      color: '#000',
    },
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.01)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      position: 'absolute',
      backgroundColor: '#fff',
      //padding: 10,
     // borderRadius: 5,
     // elevation: 5,
    },
  });
  
  export default EmployeeItem;

