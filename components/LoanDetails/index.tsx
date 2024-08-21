import Color from 'color';
import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, TextStyle, ViewStyle, Image, TouchableOpacity } from 'react-native';
import APP_IMAGES from '../../constants/images';
import fonts from '../../constants/fonts';
import { ILoan} from 'money-loaner-api-types';
import Buttons from '../Buttons';

import { useAppThemeColor } from '@/hooks/useThemeColor';
import { IAppColors } from '@/constants/Colors';




interface LoanDetailsProps {
  visible:boolean,
  loan: ILoan,
  onClose: () => void,
  onDownloadReceip: (loan:ILoan)=>void,
}

const LoanDetails: React.FC<LoanDetailsProps> = ({ visible, loan, onClose, onDownloadReceip }) => {
  const colors = useAppThemeColor()
    const styles = customStyles(colors)
  
  if (!loan) {
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
          <Text style={styles.title}>{`Pret N° [${loan?.no}]`}</Text>
        
            <ScrollView style={styles.scrollView} contentContainerStyle={{gap:10}}>
              
              <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection:'row',gap:5, width:'100%' }}>
              <Text >Montant Emprunter</Text>
                <Text style={{...fonts.bodyHighLight, color:colors.black} as TextStyle}>{loan.amount || 'ERROR OnDef'}</Text>
            </View>
            
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection:'row',gap:5, width:'100%' }}>
              <Text >Déja Rembourser ?</Text>
                <Text style={{...fonts.bodyHighLight, color:colors.black} as TextStyle}>{loan.refunded?"Oui":'Non'}</Text>
            </View>
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection:'row',gap:5, width:'100%' }}>
              <Text >{`${loan.refunded ? 'rembourssé' : "montant à remboursser" }`}</Text>
                <Text style={{...fonts.bodyHighLight, color:colors.black} as TextStyle}>{loan.repayAmount}</Text>
            </View>


            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection:'row',gap:5, width:'100%' }}>
              <Text >Demandeur</Text>
              <View style={{width:'auto', gap:10, flexDirection:'row'}}>
                <Image source={{uri:loan.employee.photoURL}} width={28} height={28} borderRadius={100}/>
                <Text style={{...fonts.bodyHighLight} as TextStyle}>{loan.employee.name}</Text>
              </View>
                
            </View>
            
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection:'row',gap:5, width:'100%' }}>
              <Text >Poste Occupé</Text>
                <Text style={{...fonts.bodyHighLight} as TextStyle}>{loan.employee.job}</Text>
            </View>

            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection:'row',gap:5, width:'100%' }}>
              <Text >Employeur</Text>
              <View style={{width:'auto', gap:10, flexDirection:'row'}}>
                <Image source={{uri:loan.company.logoURL }} width={32} height={32}/>
                <Text style={{...fonts.bodyHighLight} as TextStyle}>{loan.company.name  }</Text>
              </View>
                
            </View>

            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection:'row',gap:5, width:'100%' }}>
              <Text >Date </Text>
                <Text style={{...fonts.bodymin, color:colors.black} as TextStyle}>{`${new Date(loan.date as Date).toLocaleDateString('fr-FR')} à ${new Date(loan.date as Date).toLocaleTimeString('fr-FR')}`}</Text>
            </View>

           
            
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection:'row',gap:5, width:'100%' }}>
              <Text >Compte de retrait</Text>
                <Text style={{...fonts.bodyHighLight} as TextStyle}>{loan.account || loan.employee.phoneNumber}</Text>
              </View>
              
              <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection:'row',gap:5, width:'100%', marginTop:10 }}>
              <Buttons.Primary title='télécharger le reçu' onPress={()=>onDownloadReceip(loan)}/>
            
              </View>
              
            </ScrollView>
          </View>
        </View>
  
    </Modal>
  );
};

const customStyles = (colors:IAppColors) => StyleSheet.create({
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

export default LoanDetails;
