/* eslint-disable prettier/prettier */
import { View, Text, SafeAreaView, TouchableOpacity, Dimensions, StyleSheet, TextStyle, Alert, Image, ScrollView, BackHandler, Modal, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import APP_IMAGES from '../../constants/images';
import fonts from '../../constants/fonts';
import Links from '../../components/Links';
import { useSelector } from '../../hooks/useSelector';
import { IFullEmployee, } from 'money-loaner-api-types';
import Color from 'color';
import { useDispatch } from 'react-redux';
import { authActions } from '../../redux/auth/auth.slice';

import LoanSection from '../../components/LoanSection';
import { getGreeting } from '../../helpers/gretting';
import { loanActions } from '../../redux/loan/loan.slice';
import OperatorLogo from '../../components/OperatorLogo';
import { getOperator } from '../../helpers/mobileOperator';
import { cameroonPhoneRegex } from '../../constants/regExp';
import CommonStyle from '../../styles/common';
import { useAppThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { IAppColors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';








const { width, height } = Dimensions.get('window');


const getPercentage = (percent: number, max: number) => {
  return Math.round(percent/100*max)
}

const Employee_HomeScreen= () => {

    const colors = useAppThemeColor()
    const style = CommonStyle(colors);
    const modalStyles = createModalStyles(colors)


  const dispatch = useDispatch()
  const employee = useSelector(state => state.employee.employeeInfos as IFullEmployee);
  const canDoLoan = useSelector(state => state.loan.employeeCanDoLoan);
  const loansParams = useSelector(state => state.employee.employeeInfos?.companyId.loanParameters)
  const loanLoading = useSelector(state => state.loan.loading);
  const loanCreatedSuccess = useSelector(state => state.loan.loanCreatedSuccess);
  const errorCreatedLoan = useSelector(state => state.loan.error);
  const [account, setAccount] = useState(employee.phoneNumber);
  const [tempAccount, setTemplAccount] = useState(employee.phoneNumber);
  const [errorAccount, setErrorAccount] = useState('');
  const [showConfirmPanel, setShowConfirmPanel] = useState(false);

  const [showAccountModifier, setShowAccountModifier] = useState(false)
  
  useEffect(() => {
    dispatch(authActions.clearAuhtData())
    dispatch(loanActions.clearError())
    dispatch(loanActions.getAllEmployeeLoansStart({employeeId:employee._id}))
    dispatch(loanActions.verifyEmployee({ employeeId: employee._id }))
    dispatch(loanActions.clearCreateData())
    
},[])
  
  useEffect(() => {

    if (loanCreatedSuccess && loanLoading === false) {
    Alert.alert("pret effectuer avec succes");
    dispatch(loanActions.clearCreateData())


  } 

    if (errorCreatedLoan && loanLoading === false) {
      Alert.alert("la demande de pret à échouer ", `raison : ${errorCreatedLoan}`);
      
    
  }
  },[loanCreatedSuccess, loanLoading, errorCreatedLoan])
  
  
  



  useEffect(() => {
    const backAction = () => {
      Alert.alert("Quitter l'application", "Êtes-vous sûr de vouloir fermer l'application?", [
        {
          text: "Annuler",
          onPress: () => null,
          style: "cancel"
        },
        { text: "Oui", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);





  const handleAskForLoan = (value: number) => {
  dispatch(loanActions.createLoanStart({employeeId:employee._id, companyId:employee.companyId._id, repayAmount: value + (value*5)/100, amount:value, account:account!}))
}


  
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


  return (
    <View style={{...style.page, padding:0,margin:0, paddingVertical:0, paddingHorizontal:0}} >
      {/* Header */}
      {/* <View style={{ width: '100%', alignItems: 'center', height: "auto", justifyContent: 'space-between', flexDirection: 'row',padding:10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 5 }}>
          <APP_IMAGES.LOGO width={32} height={32} />
          <Text style={{ ...fonts.title, color: colors.primary } as TextStyle}>Money Loaner</Text>
        </View>
        <TouchableOpacity onPress={()=>router.push("/employee_content/profile")} style={{ borderStartColor: colors.white, borderRadius: 100 }}>
         
          {employee?.photoURL != null && employee?.photoURL != 'none' ? <Image source={{ uri: employee?.photoURL }} style={{ borderRadius: 100, marginBottom:5 }} width={48} height={48} /> :
                  <View style={{ borderRadius: 100, padding: 0, height: 48, width: 48, marginBottom:5 }} ><APP_IMAGES.ICON_FIELD_EMPTY_EMPLOYEE height={48} width={48} fill={colors.background} /></View>}
              
          
        </TouchableOpacity>

      </View> */}

      
      {/**Le contenu */}
      <ScrollView style={{width:'100%'}} contentContainerStyle={[{...style.page,backgroundColor:Color(colors.background).darken(0.02).toString(), borderRadius:8,width:'100%'}, {justifyContent:'flex-start', gap:20}]}>
   
        <View style={{flexDirection:'row', gap:10, width:"100%", justifyContent:"space-between", alignItems:"center" }}>
          <View style={{flexDirection:"row", gap:10}}>
            <Text style={{ color: colors.black }}>{getGreeting()}</Text>
          <Text style={{ color: colors.secondary }}>{employee?.name}
            <Text style={{ color: colors.black }}>,</Text>
          </Text>
          </View>
          
          <TouchableOpacity onPress={()=>{
               dispatch(loanActions.verifyEmployee({ employeeId: employee._id }))
          }}>
            <Ionicons name="refresh-circle" style={{fontSize:32, color:colors.primary}}/>
          </TouchableOpacity>
          
        </View>
        <LoanSection initialValue={getPercentage(loansParams?.maxPercentage!,Number(employee.salary))} min={loansParams?.minAmount!} max={getPercentage(loansParams?.maxPercentage!,Number(employee.salary))} step={loansParams?.stepAmount!}  onAskForLoan={handleAskForLoan} disabled={!canDoLoan} />
       
        <View style={{justifyContent:'center', alignItems:'center', gap:20, padding:10}}>
          <Text style={{ ...fonts.bodyHighLight, color: colors.black, textAlign: 'center', width: '100%' } as TextStyle}>Compte de Retrait</Text>
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', width:'100%'}}>
            <OperatorLogo phoneNumber={account || employee.phoneNumber!} size={64} />
            <Text style={{ ...fonts.title } as TextStyle}>{account || employee.phoneNumber!}</Text>
            <TouchableOpacity onPress={()=>setShowAccountModifier(true)}>
              <APP_IMAGES.EMOJI_PEN height={48} width={48}/>
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={showAccountModifier}
          transparent={true}
          animationType='slide'
          onRequestClose={()=>setShowAccountModifier(false)}
        >
          <View style={modalStyles.modalBackground}>
            <View style={modalStyles.modalContainer}>
            <TouchableOpacity onPress={()=>setShowAccountModifier(false)} style={{width:'100%', justifyContent:'flex-end', alignItems:'flex-start', marginBottom:5}}><APP_IMAGES.ICON_CLOSE_MENU width={32} height={32} fill={Color(colors.black).alpha(0.5).toString()}/></TouchableOpacity>
              <Text style={modalStyles.title}>Modifier le compte de retrait</Text>
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


          <Modal
          visible={showConfirmPanel}
          transparent={true}
          animationType='slide'
          onRequestClose={()=>setShowConfirmPanel(false)}
        >
          <View style={modalStyles.modalBackground}>
            <View style={modalStyles.modalContainer}>
            <TouchableOpacity onPress={()=>null} style={{width:'100%', justifyContent:'flex-end', alignItems:'flex-start', marginBottom:5}}><APP_IMAGES.ICON_CLOSE_MENU width={32} height={32} fill={Color(colors.black).alpha(0.5).toString()}/></TouchableOpacity>
              <Text style={modalStyles.title}>Confirmer la demande</Text>
              <View style={{...modalStyles.scrollView, gap:10,}}>
                <View style={{width:'100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomColor: colors.black, borderBottomWidth: 1, height:40, gap:10 }}>
                  <APP_IMAGES.ICON_CAMEROUN_FLAG height={32} width={32} />
                  <TextInput keyboardType='phone-pad' value={"tempAccount"} style={{flex:1, padding:0, backgroundColor:colors.white, color:colors.black}} onChangeText={(value)=>setTemplAccount(value)} />
                </View>

                <View style={style.flexCenter}>
                </View>
              
                <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap:10,marginBottom:20 }}>
                  <TouchableOpacity onPress={() => {
                    return null

                  }} style={{ backgroundColor: colors.white, borderRadius:10, borderColor:colors.primary, borderWidth:1, padding:10}}>
                    <Text style={{...fonts.title, color:colors.primary} as TextStyle}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>null} style={{ backgroundColor: colors.primary, borderRadius:10, borderColor:colors.primary, borderWidth:1, padding:10}}>
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

export default Employee_HomeScreen;
