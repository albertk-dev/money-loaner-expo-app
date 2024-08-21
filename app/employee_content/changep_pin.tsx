/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  SafeAreaView,
  Image,
  TextStyle,
} from 'react-native';



import Buttons from '../../components/Buttons';
import CommonStyle from '../../styles/common';
import { useSelector } from '../../hooks/useSelector';
import PinDisplay from '../../components/CodePin/PinDisplay';
import PinKeyboard from '../../components/CodePin/PinKeyboard';
import { CODE_PIN_MAX_LENGTH } from '../../constants/data';
import { useDispatch } from 'react-redux';
import { employeeActions } from '../../redux/employee/employee.slice';
import { router } from 'expo-router';
import { useAppThemeColor } from '@/hooks/useThemeColor';



const Employee_ChangePinScreen = () => {

    
    const colors = useAppThemeColor()
    const style = CommonStyle(colors);


  const [pinCode, setPinCode] = useState('')
  const [keyboardDisabled, setKeyBoardDisabled] = useState(false)
  const [operationFinished, setOperationFinished] = useState(false)

  const employee = useSelector(state => state.employee.employeeInfos)
  
  const changeLoading = useSelector(state => state.employee.updatingEmployee);
  const changeSuccess = useSelector(state => state.employee.updateEmployeeSuccess);
  const changeError = useSelector(state => state.employee.errorUpdatingEmployee)

  const dispatch = useDispatch()



  const handleLogin = () => {
    setKeyBoardDisabled(true)
    dispatch(employeeActions.updateEmployeeRequest({ id: employee?._id!, data: { codePin: pinCode } }))   
  }


  useEffect(() => {
    if (changeError) {
      Alert.alert("Echec de connexion", changeError)
      setKeyBoardDisabled(false)
    }
}, [changeError]);


useEffect(() => {
     if (changeSuccess === true) {
       Alert.alert('Succès', `votre code a bien été modifier`)
       setOperationFinished(true)
       setTimeout(() => {
          router.back()
       }, 3000)
      
    }
},[changeSuccess])


  return (
    <SafeAreaView style={style.page}>
      <View style={style.Headerblock}>
        {/* <APP_IMAGES.LOGO width={48} height={54} /> */}
        <Text style={style.HeaderText}>Modifier le code Pin</Text>
      </View>




      <PinDisplay pin={pinCode} />
      <PinKeyboard disabled={keyboardDisabled} maxLength={CODE_PIN_MAX_LENGTH} onChange={(pin)=>setPinCode(pin)} onMaxLengthReached={()=>null} />

      {/** Zone des boutons */}
    

      <View style={{ display: 'flex', gap: 10 }}>
        <Buttons.Primary
          isLoading={changeLoading!}
          disabled={pinCode.length < CODE_PIN_MAX_LENGTH}
          onPress={handleLogin}
        />
        <Buttons.Previous onPress={() => {
          dispatch(employeeActions.resetUpdatingEmployee())
          router.back()
        }} />
      </View>

    </SafeAreaView>
  );
};

export default Employee_ChangePinScreen;
