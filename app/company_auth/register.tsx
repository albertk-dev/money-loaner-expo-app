/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Text, View, TouchableWithoutFeedback, Keyboard, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { KeyboardAccessoryView } from "react-native-keyboard-accessory";
import { useForm, Controller } from 'react-hook-form';
import * as ImagePicker from 'expo-image-picker';
import {storage} from '../../firebaseConfig'
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage'
import fonts from '../../constants/fonts';
import APP_IMAGES from '../../constants/images';
import Buttons from '../../components/Buttons';
import CommonStyle from '../../styles/common';
import Links from '../../components/Links';
import TextFields from '../../components/TextField';
import CustomAlert from '../../components/CustomAlert';
import CustomStatusBar from '../../components/CustomStatusBar';
import {  IRegisterCompanyRequestBody } from 'money-loaner-api-types';
import ML_API from '../../api';
import { useAppThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
// Assurez-vous d'importer correctement vos types





type CompanyRegisterFormData = {
    companyLogo: string | null;
    companyName: string;
    companyEmail: string;
    password: string;
    passwordConfirmation: string;
};

export type UploadToFirebaseCompleted = {
    logoCloudImagePath: string;
    logoURL: string;
}



const Company_RegisterCompanyScreen = () => {

    const colors = useAppThemeColor()
    const style = CommonStyle(colors)

    const [image, setImage] = useState<string | null>(null);


    const [isOperationInProgress, setIsOperationInProgress] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [statusMessage, setStatusMessage] = useState<string>('initialisation...');
    
    const uploadToFirebase = async (companyName : string,imageURI:string): Promise<any> => {
      
        const imageName = `logo/${Date.now()}_${companyName}`;
        const reference = ref(storage, imageName);
        // Convertir l'image en un blob
    const response = await fetch(imageURI);
    const blob = await response.blob();

   const uploadTask = uploadBytesResumable(reference, blob)

    uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Calculer la progression en pourcentage
          const uprogress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setStatusMessage(`Upload du logo ${uprogress.toFixed(2)}% terminée`)
          setProgress(uprogress / 2)
        },
        (error) => {
          // Gérer les erreurs ici
          console.error('Error uploading image: ', error);
              setStatusMessage('Upload failed!');
              throw error
        },
        () => {
          // Gérer le succès complet ici
          setStatusMessage('Upload du logo terminée');
            getDownloadURL(uploadTask.snapshot.ref).then((url)=>{
                const data: UploadToFirebaseCompleted = { logoCloudImagePath: imageName, logoURL: url }
              return data;
            });
        }
      );
      };

    const { control, handleSubmit, formState: { errors, isSubmitting, isDirty }, setValue, watch, clearErrors, trigger } = useForm<CompanyRegisterFormData>();

    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("")

    const [alertMessage, setAlertMessage] = useState('');


    const showAlert = (message: string, title:string = "Erreur de validation") => {
        setAlertMessage(message);
        setAlertVisible(true);
        setAlertTitle(title)
    };

    const closeAlert = () => {
        setAlertVisible(false);
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
            setImage(result?.assets[0]?.uri!);
            setValue('companyLogo', result?.assets[0]?.uri!); // Met à jour la valeur du champ 'image'
            clearErrors('companyLogo');
        }
      };

    const removeImage = () => {
        setImage(null);
        setValue("companyLogo", null);
        trigger('companyLogo');
    };

    const onSubmit = async (data: CompanyRegisterFormData) => {
        try {
            setIsOperationInProgress(true)
            const logoInfo:UploadToFirebaseCompleted = await uploadToFirebase(data.companyName, data.companyLogo!);
            setStatusMessage("formatage des données...")
            const companyFormatedData: IRegisterCompanyRequestBody = {
                name: data.companyName,
                logoURL: logoInfo.logoURL,
                logoCloudImagePath: logoInfo.logoCloudImagePath,
                email: data.companyEmail,
                password: data.password,
                socialId: `${data.companyName}_${Date.now()}`
            };
            setProgress((progress)=> progress+10 )
            setStatusMessage("enregistrement de l'entreprise...")
            const company = await ML_API.registerCompany(companyFormatedData);
            setProgress(100)
            setStatusMessage("terminée")
            setProgress(0);
            setStatusMessage('');
            setIsOperationInProgress(false)
            showAlert(company.message, data.companyName);

            // Simule un processus de soumission
            await new Promise(resolve => setTimeout(resolve, 100));
            
            //lancer le login direct
            
            router.push({
                pathname:'/company_auth/login_after_register',
                params:{
                    email:data.companyEmail,
                    password:data.password,
                    logoURL:logoInfo.logoURL,
                    name: data.companyName
                }
            })

        } catch (error) {
            console.error(error);
            
            setStatusMessage("echec lors de l'enregistrement...")
             // Simule un processus de soumission
             await new Promise(resolve => setTimeout(resolve, 3000));
            setIsOperationInProgress(false)
            showAlert(`Echec d'enregistrement ${error}`, data.companyName)
        }
    };

    const password = watch("password");

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={{ flex: 1,gap:20 }}>

                <ScrollView contentContainerStyle={{ ...style.page, flex: 0, flexGrow: 1, gap:20, flexShrink: 0, marginBottom: isOperationInProgress?60:20 }}>

                    <View style={style.Headerblock}>
                        <APP_IMAGES.LOGO width={48} height={54} />
                        <Text style={style.HeaderText}>Money Loaner</Text>
                    </View>

                    <Controller
                        control={control}
                        name="companyLogo"
                        rules={{ required: 'Votre logo est votre identité aux yeux de vos employés et du monde. Ne l\'oubliez pas' }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={{ ...style.flexCenter, marginBottom: 2, width: '100%', padding: 15, position: 'relative', borderWidth: 1, borderRadius: 10, borderColor: (errors.companyLogo ? colors.danger : 'transparent') }}>
                                {image ?
                                    (<Image source={{ uri: image }} style={{ width: 128, height: 128, marginBottom: 5, borderRadius: 4 }} />)
                                    :
                                    <APP_IMAGES.COMPANY_CHOOSE_COMPANY_IMAGE width={128} height={128} />}
                                <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
                                    {!image ? <Buttons.Container onPress={pickImage}>
                                        <APP_IMAGES.ICON_CLOUD width={32} height={32} fill={colors.primary} />
                                        <Text style={{ color: colors.primary, ...fonts.bodyHighLight } as any}>Importer le logo</Text>
                                    </Buttons.Container> :
                                        <Buttons.Container onPress={removeImage}>
                                            <Text style={{ color: colors.primary, ...fonts.bodyHighLight } as any}>Supprimer</Text>
                                        </Buttons.Container>}
                                </View>

                                {errors.companyLogo && (
                                    <TouchableOpacity onPress={() => showAlert(errors?.companyLogo?.message!)} style={{ backgroundColor: colors.danger, position: "absolute", right: 0, top: 0, borderTopRightRadius: 10, borderBottomLeftRadius: 10 }}>
                                        <APP_IMAGES.ICON_ALERT width={32} height={32} />
                                    </TouchableOpacity>
                                )}

                            </View>
                        )}
                    />

                    <View style={{ gap: 20, marginBottom: 20, flex:1, justifyContent:'center' }}>
                        <Controller
                            control={control}
                            name="companyName"
                            rules={{ required: 'Ce champ est requis' }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextFields.ContainedDefault
                                    placeholder='Raison sociale'
                                    svgStartIcon={APP_IMAGES.ICON_SOCIAL_NAME}
                                    startIconProps={{ fillOpacity: 0.5 }}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={errors.companyName && errors.companyName.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="companyEmail"
                            rules={{
                                required: 'Ce champ est requis',
                                pattern: { value: /^\S+@\S+$/i, message: 'Email invalide' },
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextFields.ContainedDefault
                                    placeholder='Email'
                                    svgStartIcon={APP_IMAGES.ICON_EMAIL_FIELD}
                                    startIconProps={{ fillOpacity: 0.5 }}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    textInputProps={{keyboardType:'email-address',autoCapitalize:'none', autoCorrect:false}}
                                    error={errors.companyEmail && errors.companyEmail.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="password"
                            rules={{
                                required: 'Ce champ est requis',
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextFields.Password
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    error={errors.password && errors.password.message}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="passwordConfirmation"
                            rules={{
                                required: 'Ce champ est requis',
                                validate: (value) => {
                                    return value === password || 'Les mots de passe ne correspondent pas';
                                }
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextFields.Password
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    value={value}
                                    placeholder='Confirmer'
                                    error={errors.passwordConfirmation && errors.passwordConfirmation.message}
                                />
                            )}
                        />
                    </View>

                    <CustomAlert
                        visible={alertVisible}
                        title={alertTitle}
                        message={alertMessage}
                        onClose={closeAlert}
                        type='error'
                    />
                </ScrollView>
     
                <KeyboardAccessoryView style={{ paddingVertical: 5, marginBottom: 20, height: 'auto' }} alwaysVisible={true} androidAdjustResize>
                    {({ isKeyboardVisible }) => (
                        <View style={{ gap: 10, justifyContent: 'center', alignItems: 'center' }}>
                           
                                <Buttons.Primary title="S'enregistrer" disabled={!isDirty} isLoading={isSubmitting} onPress={handleSubmit(onSubmit)} />
                            

                            {!isKeyboardVisible && (
                                <View style={{ display: 'flex', flexDirection: 'row', gap: 5 }}>
                                    <Text style={{ ...fonts.bodymin, color: 'black' } as any} >Votre entreprise est déjà enregistrée?</Text>
                                    <Links.Primary title='Connectez-vous' onPress={() => router.push("/company_auth/")} />
                                </View>
                            )}
                                       {isOperationInProgress && (
        <CustomStatusBar progress={progress} statusMessage={statusMessage} />
      )}

                        </View>
                    )}
                </KeyboardAccessoryView>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default Company_RegisterCompanyScreen;
