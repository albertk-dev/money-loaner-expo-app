/* eslint-disable prettier/prettier */
import {
 
  StyleSheet,

  Image,
  TextStyle,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import APP_FONTS from '../../constants/fonts';

import APP_IMAGES from '../../constants/images';

import SelectCompany from '../../components/Buttons/SelectCompany';
import Links from '../../components/Links';
import { authActions } from '../../redux/auth/auth.slice';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  SafeAreaView,
} from 'react-native';

import Buttons from '../../components/Buttons';
import CommonStyle from '../../styles/common';
import { useSelector } from '../../hooks/useSelector';
import PinDisplay from '../../components/CodePin/PinDisplay';
import PinKeyboard from '../../components/CodePin/PinKeyboard';
import { CODE_PIN_MAX_LENGTH } from '../../constants/data';
import { useDispatch } from 'react-redux';
import { employeeActions } from '../../redux/employee/employee.slice';
import { router, useLocalSearchParams } from 'expo-router';
import { useAppThemeColor } from '@/hooks/useThemeColor';

const style = CommonStyle;


const Employee_PinCodeScreen = () => {

    
    const colors = useAppThemeColor()
    const style = CommonStyle(colors);
  const selectedCompany = useSelector(state => state.auth.selectedCompany);
  const [pinCode, setPinCode] = useState('')
  const [keyboardDisabled, setKeyBoardDisabled] = useState(false)
  const loginLoading = useSelector(state => state.employee.loginLoading);
  const loginSuccess = useSelector(state => state.employee.loginSuccess);
  const loginError = useSelector(state => state.employee.loginErrorMessage)

  const dispatch = useDispatch()
  const {data } = useLocalSearchParams()

  const verifiedEmployee = JSON.parse(data as string)



  const handleLogin = () => {
    setKeyBoardDisabled(true)
    dispatch(employeeActions.loginEmployeeRequest({_id:verifiedEmployee?._id!, codePin:pinCode}))   
  }


  useEffect(() => {
    if (loginError) {
      Alert.alert("Echec de connexion", loginError)
      setKeyBoardDisabled(false)
    }
}, [loginError]);


useEffect(() => {
     if (loginSuccess === true) {
       Alert.alert('Succès', `vous etes connecter en tant que ${verifiedEmployee?.name} `)
       router.replace("/employee_content")
    }
},[loginSuccess])


  return (
    <SafeAreaView style={style.page}>
      <View style={style.Headerblock}>
        <APP_IMAGES.LOGO width={48} height={54} />
        <Text style={style.HeaderText}>Money Loaner</Text>
      </View>

      <View>
        <View style={{ ...style.flexCenter, gap: 5 }}>
          {verifiedEmployee?.photoURL != null &&
            verifiedEmployee?.photoURL != 'none' ? (
            <Image
              source={{ uri: verifiedEmployee?.photoURL }}
              style={{ borderRadius: 100, marginBottom: 5 }}
              width={64}
              height={64}
            />
          ) : (
            <View
              style={{
                borderRadius: 100,
                padding: 0,
                height: 64,
                width: 64,
                marginBottom: 5,
              }}>
              <APP_IMAGES.ICON_FIELD_EMPTY_EMPLOYEE
                height={48}
                width={48}
                fill={colors.background}
              />
            </View>
          )}
        </View>
        <View>
          <Text
            style={
              {
                ...APP_FONTS.title,
                fontSize: 20,
                textAlign: 'center',
                color: colors.black,
              } as TextStyle
            }>
            {verifiedEmployee?.name}
          </Text>
        </View>
      </View>



      <PinDisplay pin={pinCode} />
      <PinKeyboard disabled={keyboardDisabled} maxLength={CODE_PIN_MAX_LENGTH} onChange={(pin)=>setPinCode(pin)} onMaxLengthReached={()=>null} />

      {/** Zone des boutons */}
    

      <View style={{ display: 'flex', gap: 10 }}>
        <Buttons.Primary
          isLoading={loginLoading}
          disabled={pinCode.length < CODE_PIN_MAX_LENGTH}
          onPress={handleLogin}
        />
        <Buttons.Previous onPress={() => {
          dispatch(employeeActions.clearData())
          dispatch(authActions.clearVerificationData())
          router.back()
        }} />
      </View>

    </SafeAreaView>
  );
};

export default Employee_PinCodeScreen;
