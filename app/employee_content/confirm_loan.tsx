/* eslint-disable prettier/prettier */
import { View, Text,  TouchableOpacity, Dimensions, Animated, StyleSheet, TouchableWithoutFeedback, TextStyle, Alert, Image, ViewStyle, ScrollView, BackHandler, TextInputProps, FlatList, KeyboardTypeOptions, ActivityIndicator, Modal, TextInput, Pressable } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

import Links from '../../components/Links';
import { authActions } from '../../redux/auth/auth.slice';
import OperatorLogo from '../../components/OperatorLogo';
import { getOperator } from '../../helpers/mobileOperator';
import { cameroonPhoneRegex } from '../../constants/regExp';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { ICompany,ILoan } from 'money-loaner-api-types';
import { useSelector } from '../../hooks/useSelector';
import { useDispatch } from 'react-redux';
import APP_IMAGES from '../../constants/images';
import fonts from '../../constants/fonts';
import Color from 'color';
import { SvgProps } from 'react-native-svg';
import CustomAlert from '../../components/CustomAlert';
import { MoreMenuItem } from '../../components/List/MoreMenu';
import DropdownMenu from '../../components/DropDownMenu';
import LoanList from '../../components/List/loanList';
import LoanDetails from '../../components/LoanDetails';
import { loanActions } from '../../redux/loan/loan.slice';
import { SafeAreaView } from 'react-native-safe-area-context';


import CommonStyle from '../../styles/common';

import { useAppThemeColor } from '@/hooks/useThemeColor';
import { router, useLocalSearchParams } from 'expo-router';
import { IAppColors } from '@/constants/Colors';
import Buttons from '@/components/Buttons';
import { Ionicons } from '@expo/vector-icons';




export type LoanBeforeConfirm = {
  employeeId:string,
  companyId:string,
  repayAmount: number,
  amount:number,
  account:string

}

type ConfirmField = {
  id:number,
  label:string,
  value:string,
}

const Company_RepayLoanScreen= () => {

    const colors = useAppThemeColor()
    const style = CommonStyle(colors);
    const modalStyles = createModalStyles(colors)
     
  const {data} = useLocalSearchParams()

  const loanData:LoanBeforeConfirm= JSON.parse(data as string)
 

  const dispatch = useDispatch()

  const loading = useSelector(state=> state.loan.loading)
  const success = useSelector(state => state.loan.loanCreatedSuccess);
  const error = useSelector(state => state.loan.error);
  const appPercentage = useSelector(state=> state.app.appPercentage)

  
  useEffect(() => {
    dispatch(authActions.clearAuhtData())
    dispatch(loanActions.clearError())
    dispatch(loanActions.clearCreateData())
    
},[])
  
  useEffect(() => {

    if (success && loading === false) {
    Alert.alert("pret effectuer avec succes");
   


  } 

    if (error && loading=== false) {
      Alert.alert("la demande de pret à échouer ", `raison : ${error}`);
      
    
  }
  },[success, loading, error])
  
  

  

  const loanVerifField:ConfirmField[] = [
    {
      id:1,
      label: "Vous empruntez la somme de",
      value: loanData.amount.toString() + " CFA"
    },
    {
      id:2,
      label: "Taux d'intéret ",
      value: appPercentage.toString() + "%"
    },
    {
      id:3,
      label: "Montant Total à Remboursser",
      value: (loanData.amount + (loanData.amount*appPercentage/100)).toString()+" CFA"
    },
    {
      id:4,
      label: "compte de récupération ",
      value: loanData.account
    }
  ]




  return (
    <View style={{...style.page, padding:0,margin:0, paddingVertical:0, paddingHorizontal:0}} >
     
 
      {/**Le contenu */}
      <ScrollView style={{width:'100%'}} contentContainerStyle={[{...style.page,backgroundColor:Color(colors.background).darken(0.02).toString(), borderRadius:8,width:'100%'}, {justifyContent:'flex-start', gap:20}]}>
   

   <View style={{gap:20,  width:"100%"}}>
    {loanVerifField.map((field)=>(
      <View style={{flexDirection:'row', justifyContent:'space-between'}} key={field.id}>
        <Text style={{color: colors.text, ...fonts.bodyHighLight} as TextStyle} >{field.label}</Text>
        <Text style={{color:colors.primary, ...fonts.bodyHighLight} as TextStyle}>{field.value}</Text>
      </View>
    ))}
    
   </View>
     
      
        <View style={{justifyContent:'center', alignItems:'center', gap:20, padding:10}}>
          <Text style={{ ...fonts.bodyHighLight, color: colors.black, textAlign: 'center', width: '100%' } as TextStyle}>Compte de Retrait</Text>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
            <OperatorLogo phoneNumber={loanData.account} size={64} />
            <Text style={{ ...fonts.title } as TextStyle}>{loanData.account}</Text>

          </View>
        </View>


        {!success && <TouchableOpacity
        
        style={{
          paddingHorizontal:30,
          paddingVertical:20,
          backgroundColor:colors.primary,
          borderRadius:10,     
          minHeight:32,
          minWidth:200,
          justifyContent:'center',
          alignItems:"center",    
        }}
        disabled={loading}
        onPress={()=>{  
          dispatch(loanActions.createLoanStart({
            employeeId:loanData.employeeId,
            companyId:loanData.companyId,
            amount: loanData.amount,
            account: loanData.account,
            repayAmount: loanData.amount + (loanData.amount*appPercentage/100)
          }))        
          }}>

          {!loading?
            <Text style={{color:colors.white,...fonts.title}as TextStyle}>Lancer l'Opération</Text>:
            <ActivityIndicator size={"small"} color={colors.white}/>
            }
        </TouchableOpacity>}

        {success && <TouchableOpacity
        
        style={{
          paddingHorizontal:30,
          paddingVertical:20,
          backgroundColor:colors.primary,
          borderRadius:10,     
          minHeight:32,
          minWidth:200,
          justifyContent:'center',
          alignItems:"center",   
          gap:10 
        }}
        disabled={loading}
        onPress={()=>Alert.alert("Telechargement du reçu... prochainement")}>

          <Ionicons name="checkbox-outline"  style={{fontSize:64, color:'#0f0'}}/>
       
            <Text style={{color:colors.white,...fonts.title}as TextStyle}>Télécharger le reçu</Text>
            
        </TouchableOpacity>}

        
    
     
      </ScrollView>
      <View style={{
         display: 'flex',
         flexDirection: 'row',
         gap: 5, flexWrap: 'wrap',
         justifyContent: "center", alignItems: 'center', marginBottom: 10
        }}>
          <Text style={{ ...fonts.bodymin, color: 'black' } as any} >Veuillez consulter la </Text>
          <Links.Primary title='politique de confidentialité' onPress={() => Alert.alert('politique de confidentialité...')} />
          <Text style={{ ...fonts.bodymin, color: 'black' } as any} > et les </Text>
          <Links.Primary title="conditions d'utilisations" onPress={() => Alert.alert("conditions d'utilisation...")} />
        </View>
   



   


    </View>
  );
};




const createModalStyles = (colors:IAppColors) =>  StyleSheet.create({
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

export default Company_RepayLoanScreen;
