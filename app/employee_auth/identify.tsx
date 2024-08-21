import React, { useEffect } from "react";
import { ActivityIndicator, Alert, Button, Image, SafeAreaView, ScrollView, Text, TextStyle, View, TextInputProps, Touchable, TouchableWithoutFeedback, Keyboard } from 'react-native';



import { authActions } from "../../redux/auth/auth.slice";
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


type EmployeeVerifyFormData = {
    inCompanyId: string;
}

const Employee_IdentifyScreen = () => {
    const colors = useAppThemeColor()
    const style = CommonStyle(colors);
    
    const { control, handleSubmit, formState: { errors, isDirty, isSubmitting }, setError } = useForm<EmployeeVerifyFormData>();

    const dispatch = useDispatch();

    const company = useSelector(state => state.auth.selectedCompany);
    const verif_employee = useSelector(state => state.auth.verifiedEmployee)
    const success_verif = useSelector(state => state.auth.verifyEmployeeSuccess);
    const error_verif = useSelector(state => state.auth.errorVerifyEmployee);
    const loading_verif = useSelector(state => state.auth.verifyingEmployee);

    const onSubmit = async (data: EmployeeVerifyFormData) => {
        try {
            if (company) {
                dispatch(authActions.verifyEmployeeRequest({inCompanyId: data.inCompanyId, companyId:company._id}));
            }
        } catch (error) {
            console.error('Erreur de soumission :', error);
            setError('inCompanyId', { type: 'manual', message: 'Erreur d\'identification, vérifier votre code employé ' });
        }
    };

    useEffect(() => {
        if (error_verif) {
            setError('inCompanyId', { type: 'manual', message: error_verif });
        }
    }, [error_verif, setError]);


    useEffect(() => {
        if (success_verif === true) {
             Alert.alert('Employee verified', verif_employee?.name)
             router.push({
                pathname:"/employee_auth/pincode",
                params: {data: JSON.stringify(verif_employee!)}
             })
           
        }
    },[success_verif])
   

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
                        <Text style={{ ...fonts.bodyHighLight, fontSize: 32, textAlign: 'center', color: colors.black } as TextStyle}>{company?.name}</Text>
                    </View>

                    <Text style={{ ...fonts.bodyHighLight, textAlign: 'center', maxWidth: 282, color: colors.black } as TextStyle}>
                    Veuillez saisir l’identifiant unique fournit par l’entreprise pour continuer
                    </Text>

                    <View style={{ margin: 20 }}>
                        <Controller
                            control={control}
                            name='inCompanyId'
                            rules={{ required: 'Ce champ est requis' }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextFields.Password
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={errors.inCompanyId?.message}
                                    textInputProps={{ editable: loading_verif || isSubmitting ? false : true, placeholder:'identifiant'}}
                                />
                            )}
                        />
                    </View>
                </ScrollView>

                <KeyboardAccessoryView style={{ paddingVertical: 5, marginBottom: 20, height: 'auto' }} alwaysVisible={true} androidAdjustResize>
                    {({ isKeyboardVisible }) => (
                        <View style={{ gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <Buttons.Primary disabled={!isDirty} onPress={handleSubmit(onSubmit)} isLoading={loading_verif!} />
                               

                            {!isKeyboardVisible && !loading_verif && !success_verif && (
                                <Buttons.Previous onPress={() => router.back()} />
                            )}
                        </View>
                    )}
                </KeyboardAccessoryView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default Employee_IdentifyScreen;
