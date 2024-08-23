import React, { useEffect } from "react";
import { ActivityIndicator, Button, Image, Text, TextStyle, View } from "react-native";
import APP_IMAGES from "../../constants/images";

import { RouteProp } from "@react-navigation/native";
import { useSelector } from "../../hooks/useSelector";
import { useDispatch } from "react-redux";

import { companyActions } from "../../redux/company/company.slice";
import fonts from "../../constants/fonts";
import commonStyles from "@/styles/common";
import { useAppThemeColor } from "@/hooks/useThemeColor";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";


type CompanyAuthParams = {
    email: string;
    password: string;
    logoURL: string;
    name: string;
  };


const Company_LoginAfterRegisterScreen = () => {
    const colors = useAppThemeColor()
    const style = commonStyles(colors)
    const { email, password, logoURL, name } = useLocalSearchParams<CompanyAuthParams>();

  // Vérification des paramètres
  if (!email || !password || !logoURL || !name) {
    console.error('Missing parameters');
    return null;  // Ou retourner un fallback approprié
  }


    const dispatch = useDispatch()

    const directLoginSuccess = useSelector(state => state.company.loginSuccess);
    const directLoginError = useSelector(state => state.company.loginErrorMessage);
    const directLoginLoading = useSelector(state => state.company.loginLoading)

    const launchLogin = () => {
        
       
            dispatch(companyActions.loginCompanyRequest({email, password}))
   
    }

    const directswitch = () => {
    
        if (directLoginSuccess) {

                router.replace("/company_content/");
            
            
        }
        
    }

    useEffect(() => {
        launchLogin()
        
    }, [])
    


    useEffect(() => {
    directswitch()
       
    },[directLoginSuccess])

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={style.page}>
                <View style={style.Headerblock}>
                    <APP_IMAGES.LOGO width={48} height={54} />
                    <Text style={style.HeaderText}>Money Loaner</Text>
                </View>
                <View style={{...style.flexCenter, gap:5}}>
                    <Image source={{ uri: logoURL }} width={200} height={200} />
                    <Text style={{...fonts.bodyHighLight,fontSize:32, textAlign:'center'} as TextStyle}>{name}</Text>
                </View>

                {directLoginLoading && <View style={{maxWidth:240, marginBottom:50, paddingBottom:50}}>
                      <Text style={{textAlign: "center",...fonts.bodymin } as any}>veuillez patienter, nous préparons votre interface...</Text>

                <ActivityIndicator size={100} color={colors.primary} style={{marginTop:20}} />
                </View>}
                {!directLoginLoading && !directLoginSuccess && directLoginError &&
                    <View>
                        <Text>La connexion automatique à échouer veuillez reéssayer</Text>
                        <Button onPress={launchLogin} title="Réessayer"/>
                    </View>}

              
                
                


            </View>

        </SafeAreaView>
    )

}




export default Company_LoginAfterRegisterScreen