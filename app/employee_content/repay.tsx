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


const getPercentage = (percent: number, max: number) => {
  return Math.round(percent/100*max)
}

interface IRepayData {
  loans: ILoan[],
  company: ICompany,
}

interface IRepayVerifField{
  id:number,
  label: string,
  value: string,
}

const Company_RepayLoanScreen= () => {

    const colors = useAppThemeColor()
    const style = CommonStyle(colors);
    const modalStyles = createModalStyles(colors)
     
  const {data} = useLocalSearchParams()

  const repayData:IRepayData = JSON.parse(data as string)
  const unRefundedLoans = repayData.loans.filter(l=>!l.refunded)
  

    const [account, setAccount] = useState(repayData.company?.phoneNumber || repayData.loans[0].account);
    const [tempAccount, setTemplAccount] = useState(repayData.company?.phoneNumber || repayData.loans[0].account);
    const [errorAccount, setErrorAccount] = useState('');
    
  const [showAccountModifier, setShowAccountModifier] = useState(false)
  

  const dispatch = useDispatch()

  const loading = useSelector(state=> state.loan.loading)
  const success = useSelector(state => state.loan.repayLoanSuccess);
  const error = useSelector(state => state.loan.error);

  
 

  
  const onChangeAccount = (account:string) => {
    const operator = getOperator(account.trim());
    if (!cameroonPhoneRegex.test(account.trim())) {
      setErrorAccount("ce numéro n'est pas camerounnais")
    } else if (operator !== 'mtn' && operator !== 'orange') {
      setErrorAccount("cet opérateur n'est pas supporter")
      } else {
      setErrorAccount("")
      setAccount(account)
      setShowAccountModifier(false)
    }
    
  }

  const repayVerifField:IRepayVerifField[] = [
    {
      id:1,
      label: "Nombre de prets à  remboursser ",
      value: unRefundedLoans.length.toString()
    },
    {
      id:2,
      label: "Montant Total Emprunté",
      value: unRefundedLoans.reduce((acc,curr)=> acc + curr.amount,0).toString()+" CFA"
    },
    {
      id:3,
      label: "Montant Total à Remboursser",
      value: unRefundedLoans.reduce((acc,curr)=> acc + curr.repayAmount,0).toString()+" CFA"
    },
    {
      id:4,
      label: "intérets ",
      value: unRefundedLoans.reduce((acc,curr)=> acc + (curr.repayAmount-curr.amount),0).toString()+" CFA"
    }
  ]

  if (unRefundedLoans.length === 0) {
    router.push("/company_content/gestion_prets")
  }
  


  return (
    <View style={{...style.page, padding:0,margin:0, paddingVertical:0, paddingHorizontal:0}} >
     
 
      {/**Le contenu */}
      <ScrollView style={{width:'100%'}} contentContainerStyle={[{...style.page,backgroundColor:Color(colors.background).darken(0.02).toString(), borderRadius:8,width:'100%'}, {justifyContent:'flex-start', gap:20}]}>
   

   <View style={{gap:20,  width:"100%"}}>
    {repayVerifField.map((field)=>(
      <View style={{flexDirection:'row', justifyContent:'space-between'}} key={field.id}>
        <Text style={{color: colors.text, ...fonts.bodyHighLight} as TextStyle} >{field.label}</Text>
        <Text style={{color:colors.primary, ...fonts.bodyHighLight} as TextStyle}>{field.value}</Text>
      </View>
    ))}
    
   </View>
     
      
        <View style={{justifyContent:'center', alignItems:'center', gap:20, padding:10}}>
          <Text style={{ ...fonts.bodyHighLight, color: colors.black, textAlign: 'center', width: '100%' } as TextStyle}>Compte de Payment</Text>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
            <OperatorLogo phoneNumber={account || repayData.company?.phoneNumber!} size={64} />
            <Text style={{ ...fonts.title } as TextStyle}>{account || repayData.company?.phoneNumber!}</Text>
            <TouchableOpacity onPress={()=>setShowAccountModifier(true)}>
              <APP_IMAGES.EMOJI_PEN height={48} width={48}/>
            </TouchableOpacity>
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
          dispatch(loanActions.repayLoanStart({
          mode:"multiple", 
          companyId:repayData.company._id,
          loans_Ids:repayData.loans.map(l=>l._id),
          repayAccount: account,
          }))}}>

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

        <Modal
          visible={showAccountModifier}
          transparent={true}
          animationType='slide'
          onRequestClose={()=>setShowAccountModifier(false)}
        >
          <View style={modalStyles.modalBackground}>
            <View style={modalStyles.modalContainer}>
            <TouchableOpacity onPress={()=>setShowAccountModifier(false)} style={{width:'100%', justifyContent:'flex-end', alignItems:'flex-start', marginBottom:5}}><APP_IMAGES.ICON_CLOSE_MENU width={32} height={32} fill={Color(colors.black).alpha(0.5).toString()}/></TouchableOpacity>
              <Text style={modalStyles.title}>Modifier le compte de payment</Text>
              <View style={{...modalStyles.scrollView, gap:10,}}>
                <View style={{width:'100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: colors.black, borderBottomWidth: 1, height:40, gap:10 }}>
                  <APP_IMAGES.ICON_CAMEROUN_FLAG height={32} width={32} />
                  <TextInput keyboardType='phone-pad' value={tempAccount} style={{flex:1, padding:0, backgroundColor:colors.white, color:colors.black}} onChangeText={(value)=>setTemplAccount(value)} />
                </View>

                <View style={style.flexCenter}>
                <OperatorLogo phoneNumber={tempAccount!} size={64} />
                </View>
                {errorAccount && <Text style={{ color: colors.danger }}>{errorAccount}</Text>}
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap:10,marginBottom:20 }}>
                  <TouchableOpacity onPress={() => {
                    setTemplAccount(account);
                    setShowAccountModifier(false)
                    setErrorAccount('')

                  }} style={{ backgroundColor: colors.white, borderRadius:10, borderColor:colors.primary, borderWidth:1, padding:10}}>
                    <Text style={{...fonts.title, color:colors.primary} as TextStyle}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>onChangeAccount(tempAccount!)} style={{ backgroundColor: colors.primary, borderRadius:10, borderColor:colors.primary, borderWidth:1, padding:10}}>
                    <Text style={{...fonts.title, color:colors.white} as TextStyle}>Modifier</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

          </View>


          </Modal>

        
    
     
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
