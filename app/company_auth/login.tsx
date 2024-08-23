import React, { useEffect } from "react";
import {  Image,  ScrollView, Text, TextStyle, View,  TouchableWithoutFeedback } from 'react-native';


import { useSelector } from "../../hooks/useSelector";
import { useDispatch } from "react-redux";
import { companyActions } from "../../redux/company/company.slice";
import { KeyboardAccessoryView } from "react-native-keyboard-accessory";
import { Controller, useForm } from "react-hook-form";

import fonts from '../../constants/fonts';
import APP_IMAGES from '../../constants/images';
import Buttons from '../../components/Buttons';
import CommonStyle from '../../styles/common';
import TextFields from '../../components/TextField';

import { useAppThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { SafeAreaView } from "react-native-safe-area-context";



type CompanyLoginFormData = {
    password: string;
}



const Company_LoginScreen = () => {
    const colors = useAppThemeColor()
    const style = CommonStyle(colors);
    
    const { control, handleSubmit, formState: { errors, isDirty, isSubmitting }, setError } = useForm<CompanyLoginFormData>();

    const dispatch = useDispatch();

    const company = useSelector(state => state.auth.selectedCompany);
    const loginSuccess = useSelector(state => state.company.loginSuccess);
    const loginError = useSelector(state => state.company.loginErrorMessage);
    const loginLoading = useSelector(state => state.company.loginLoading);

    const onSubmit = async (data: CompanyLoginFormData) => {
        try {
            if (company) {
                dispatch(companyActions.loginCompanyRequest({ email: company.email, password: data.password, _id: company._id }));
            }
        } catch (error) {
            console.error('Erreur de soumission :', error);
            setError('password', { type: 'manual', message: 'Erreur de soumission vérifiez votre mot de passe' });
        }
    };

    useEffect(() => {
        if (loginError) {
            setError('password', { type: 'manual', message: loginError });
        }
    }, [loginError, setError]);


    useEffect(() => {
         if (loginSuccess === true) {
           router.replace('/company_content/')
        }
    },[loginSuccess])
   

    return (
        <TouchableWithoutFeedback >
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ ...style.page, flex: 0, flexGrow: 1, flexShrink: 0, marginBottom: 60 }}>
                    <View style={style.Headerblock}>
                        <APP_IMAGES.LOGO width={48} height={54} />
                        <Text style={style.HeaderText}>Money Loaner</Text>
                    </View>
                    <View style={{ ...style.flexCenter, gap: 5 }}>
                        <Image source={{ uri: company?.logoURL }} width={200} height={200} style={{ borderRadius: 10 }} />
                        <Text style={{ ...fonts.bodyHighLight, fontSize: 32, textAlign: 'center', color: colors.text } as TextStyle}>{company?.name}</Text>
                    </View>

                    <Text style={{ ...fonts.bodyHighLight, textAlign: 'center', maxWidth: 282, color: colors.text } as TextStyle}>
                        Veuillez saisir votre mot de passe pour vous connecter
                    </Text>

                    <View style={{ margin: 20 }}>
                        <Controller
                            control={control}
                            name="password"
                            rules={{ required: 'Ce champ est requis' }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextFields.Password
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={errors.password?.message}
                                    textInputProps={{ editable: loginLoading || isSubmitting ? false : true }}
                                />
                            )}
                        />
                    </View>
                </ScrollView>

                <KeyboardAccessoryView style={{ paddingVertical: 5, marginBottom: 20, height: 'auto' }} alwaysVisible={true} androidAdjustResize>
                    {({ isKeyboardVisible }) => (
                        <View style={{ gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <Buttons.Primary disabled={!isDirty} onPress={handleSubmit(onSubmit)} isLoading={loginLoading!} />
                               

                            {!isKeyboardVisible && !loginLoading && !loginSuccess && (
                                <Buttons.Previous onPress={() => router.back()} />
                            )}
                        </View>
                    )}
                </KeyboardAccessoryView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default Company_LoginScreen;
