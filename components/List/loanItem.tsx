import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, Dimensions, Image, Alert, TouchableHighlight, TextStyle } from 'react-native';
import MoreMenu, { MoreMenuItem } from './MoreMenu';
import {  IFullEmployee, ILoan } from 'money-loaner-api-types';
import { IAppColors } from '../../constants/Colors';
import APP_IMAGES from '../../constants/images';
import fonts from '../../constants/fonts';
import Color from 'color';
import OperatorLogo from '../OperatorLogo';
import { useDispatch } from 'react-redux';
import { loanActions } from '../../redux/loan/loan.slice';
import { useAppThemeColor } from '@/hooks/useThemeColor';


type LoanItemProps = {
  loan: ILoan;
 onRepay:(loan:ILoan)=>void,
    menuItems: MoreMenuItem<ILoan>[];
  entityType: 'employee' | 'company';
  readyToSelect?: boolean;
  onSelect: (selected: boolean, data:ILoan) => void;
};

const LoanItem: React.FC<LoanItemProps> = ({ loan,menuItems, entityType,  readyToSelect = false, onSelect, onRepay }) => {

  const colors = useAppThemeColor()
  const styles = customStyles(colors);
  const dispatch = useDispatch();
  
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
      
  const adaptedMenu:MoreMenuItem<ILoan>[] = [ 
    ...(!loan.refunded? [{
      text: 'Rembousser',
      onClick: (data:ILoan)=>{
        onRepay(data)
      },
      available:true,
    }] : [])
    ,{
    text: selected? 'Désélectionner':'Sélectionner',
    onClick: (data: ILoan) => {
      onSelect(!selected, data)
      setSelected(!selected)
    },
    available:true,
    
  },...menuItems]
    
      
        return (
          <View  style={styles.container}>
            {readyToSelect &&
              <TouchableHighlight onPress={()=>{    onSelect(!selected, loan)
                setSelected(!selected)}} style={{padding:1,  borderRadius: 100, borderWidth: 2, borderColor: colors.primary }}>
              <View style={{ height: 10, width: 10, backgroundColor: selected ? colors.primary : colors.text, borderRadius: 100,  }} />

              </TouchableHighlight>
              
            }
             
            {
              entityType === 'company' ? (loan.employee.photoURL != null && loan.employee.photoURL != 'none' ? <Image source={{ uri: loan.employee.photoURL }} style={{ borderRadius: 100 }} width={48} height={48} /> :
                <View style={{ borderRadius: 100, padding: 0, height: 48, width: 48 }} ><APP_IMAGES.ICON_FIELD_EMPTY_EMPLOYEE height={48} width={48} fill={colors.background} /></View>) : 
              
                <View style={{ borderRadius: 10, padding: 0, height: 48, width: 48 }} ><OperatorLogo phoneNumber={loan?.account! || loan?.employee?.phoneNumber!} size={48} /></View> 
            }
          
            
            <TouchableOpacity delayLongPress={200} onLongPress={() => {
            onSelect(!selected, loan)
      setSelected(!selected)
            }} style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                
                    <Text style={styles.name}>{loan.amount || 'MONTANT'}</Text>
                  
             
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
                    <MoreMenu data={loan} items={adaptedMenu} onClose={() => setIsMenuVisible(false)} />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        );
      };
  
  const customStyles = (colors:IAppColors) => StyleSheet.create({
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
      color: Color(colors.black).alpha(0.5).toString(),
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
  
  export default LoanItem;

