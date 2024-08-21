/* eslint-disable prettier/prettier */
import { View, Text,  TouchableOpacity, Dimensions, Animated,  StyleSheet, TouchableWithoutFeedback, TextStyle, Alert, Image, ViewStyle, ScrollView, BackHandler, TextInputProps, FlatList, KeyboardTypeOptions, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from '../../hooks/useSelector';
import { ICompany, } from 'money-loaner-api-types';
import Color from 'color';
import { useDispatch } from 'react-redux';
import { authActions } from '../../redux/auth/auth.slice';
import { companyActions } from '../../redux/company/company.slice';
import fonts from '../../constants/fonts';
import APP_IMAGES from '../../constants/images';
import Buttons from '../../components/Buttons';
import CommonStyle from '../../styles/common';
import Links from '../../components/Links';
import { useAppThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { IAppColors } from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';



const { width, height } = Dimensions.get('window');



const Company_HomeScreen= () => {

    const colors = useAppThemeColor()
    const style = CommonStyle(colors);
    const styles = customStyles(colors)

  const dispatch = useDispatch()
  const company = useSelector(state => state.company.companyInfos as ICompany);

  useEffect(() => {
    dispatch(authActions.clearAuhtData())
    dispatch(companyActions.getEmployeesrequest({companyId:company._id}))
  
},[])

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








  return (
    <SafeAreaView style={{...style.page, padding:0,margin:0, paddingVertical:0, paddingHorizontal:0}} >
      {/* Header */}
      {/* <View style={{ width: '100%', alignItems: 'center', height: "auto", justifyContent: 'space-between', flexDirection: 'row',padding:10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 5 }}>
          <APP_IMAGES.LOGO width={32} height={32} />
          <Text style={{ ...fonts.title, color: colors.primary } as TextStyle}>Money Loaner</Text>
        </View>
        <TouchableOpacity onPress={()=>router.push('/company_content/profile')  } style={{ borderStartColor: colors.white, borderRadius: 100 }}>
          {company ? <Image source={{ uri: company?.logoURL }} width={48} height={48} style={{ borderRadius: 100 }} /> :
            <View style={{ height: 48, width: 48, borderRadius: 100, backgroundColor: colors.secondary,...style.flexCenter }}>
              ML
            </View>
            }
        </TouchableOpacity>

      </View> */}

      
      {/**Le contenu */}
      <ScrollView style={{width:'100%'}} contentContainerStyle={[{...style.page,backgroundColor:Color(colors.background).darken(0.02).toString(), borderRadius:8,width:'100%'}, company.employees?.length === 0 ? styles.content_without_employee: styles.content_with_employee]}>
   
        {company.employees?.length !== 0 && 
          <View>
            <Text>Activités récentes</Text>
          </View>}
        
        {company.employees?.length === 0 && <View style={{width:250, gap:10,justifyContent:'center', alignItems:'center'}}>
          <Text style={{...fonts.bodyHighLight, color:colors.black, fontSize:20, textAlign:'center'} as TextStyle}>Bienvenue dans Money Loaner 🎉</Text>
          <Text style={{...fonts.body, color:colors.black, fontSize:16, textAlign:'center'} as TextStyle}>Enregistrez vos employés pour qu'ils 
            puissent accéder aux prêts. </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap:5, justifyContent:'center'}}>
             <Text style={{...fonts.body, color:colors.black} as TextStyle}>Cliquez sur</Text>
          <Text style={{...fonts.title, color:colors.black, } as TextStyle}>Ajouter un employé</Text>
          <Text style={{...fonts.body, color:colors.black} as TextStyle}>pour commencer.</Text>
          </View>
         
          <Buttons.Primary title='Ajouter un employé' onPress={()=>router.push("/company_content/add_employee")}/>
        </View>}

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
   


    </SafeAreaView>
  );
};

const customStyles = (colors: IAppColors) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  hamburgerButton: {
    fontSize: 48
  },
  hamburgerText: {
    fontSize: 30,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Color(colors.primary).alpha(0.5).toString(),
  },
  menuItem: {
    padding: 10,
    fontSize: 18,
  },
  content_with_employee: {
    justifyContent:'space-between'
  },
  content_without_employee: {
    justifyContent: 'center',
    alignItems:'center'
  }
});

export default Company_HomeScreen;
