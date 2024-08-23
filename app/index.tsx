
import ML_API from '@/api'
import fonts from '@/constants/fonts'
import APP_IMAGES from '@/constants/images'
import { useAppThemeColor } from '@/hooks/useThemeColor'
import { authActions } from '@/redux/auth/auth.slice'
import { companyActions } from '@/redux/company/company.slice'
import { employeeActions } from '@/redux/employee/employee.slice'
import commonStyles from '@/styles/common'
import { router } from 'expo-router'
import { ICompany, IFullEmployee } from 'money-loaner-api-types'
import React, { useEffect } from 'react'
import { ActivityIndicator, SafeAreaView, Text, TextStyle, View } from 'react-native'
import { useDispatch } from 'react-redux'


export default function LoadingScreen() {
    const colors = useAppThemeColor()
    const styles = commonStyles(colors)
    

    const dispatch = useDispatch();


  

    useEffect(() => {
      dispatch(authActions.fetchCompaniesRequest())
      console.log("loading ...")
      const verifyToken = async () => {
        try {
              const tokenRefreshed = await ML_API.refreshToken();
        if (tokenRefreshed) {
          const connectedEntityType = ML_API.currentUserType;
          if (connectedEntityType === 'company') {
              const connectedEntity = ML_API.currentUser as ICompany;
              dispatch(companyActions.loginCompanySuccess(connectedEntity));
              dispatch(authActions.setSelectedCompany(connectedEntity));
              dispatch(authActions.setConnectedEntityType('company'))
              dispatch(authActions.setConnectedEntityData(connectedEntity))
            dispatch(authActions.setXRSFtoken(ML_API.xsrfToken))
  
            router.replace("/company_content/")
          }
          if (connectedEntityType === 'employee') {
            const connectedEntity = ML_API.currentUser as IFullEmployee;
            dispatch(employeeActions.loginEmployeeSuccess(connectedEntity));
            dispatch(authActions.setConnectedEntityType('employee'))
            dispatch(authActions.setConnectedEntityData(connectedEntity))
          dispatch(authActions.setXRSFtoken(ML_API.xsrfToken))
  
            router.replace("/employee_content/")
        }
          
        } else {
          dispatch(authActions.clearAuhtData())
          dispatch(companyActions.clearData())
          router.replace("/choose_entity")
          
        }
        } catch (error) {
          dispatch(authActions.clearAuhtData())
          dispatch(companyActions.clearData())
          router.replace("/choose_entity")
        }
    
      }
      
      verifyToken()
  
        return () => {
     
      };
    }, [dispatch]);
    
  return (
    <SafeAreaView style={[styles.page, styles.flexCenter, {gap:30}]}>
       <View style={{ justifyContent: 'center', alignItems: 'center', gap: 5 }}>
          <APP_IMAGES.LOGO width={100} height={100} />
        <Text style={{ ...fonts.title, color: colors.primary } as TextStyle}>Money Loaner</Text>
      </View>
      <ActivityIndicator size={'large'} color={colors.primary} />
    </SafeAreaView>
  )
}
