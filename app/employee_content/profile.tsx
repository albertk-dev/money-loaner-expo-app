/* eslint-disable prettier/prettier */
import { View, Text, SafeAreaView, TouchableOpacity, TextStyle, Alert, Image, ScrollView, TextInputProps, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ICompany, IEmployee, IFullEmployee, IUpdateEmployeeRequest } from 'money-loaner-api-types';
import ProfileTextField from '../../components/TextField/ProfileTextField';
import { SvgProps } from 'react-native-svg';
import CustomAlert from '../../components/CustomAlert';
import CustomStatusBar from '../../components/CustomStatusBar';
import { cameroonPhoneRegex, emailRegex } from '../../constants/regExp';
import { UploadEmployeeImageToFirebaseCompleted } from '../company_content/update_employee';
import { employeeActions } from '../../redux/employee/employee.slice';
import { useSelector } from '../../hooks/useSelector';
import Color from 'color';
import { useDispatch } from 'react-redux';
import fonts from '../../constants/fonts';
import APP_IMAGES from '../../constants/images';
import CommonStyle from '../../styles/common';
import Links from '../../components/Links';
import { useAppThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/firebaseConfig';


type EmployeeUpdatable = Omit<IEmployee, 'createdAt' | 'updatedAt' | "employees">

type ProfileField = {
  name: keyof EmployeeUpdatable;
  label: string;
  required?: boolean;
  rhfRules?: any;
  canEdit?: boolean | true
  startIcon?: React.FC<SvgProps>;
  endIcon?: React.FC<SvgProps>;
  startIconProps?: SvgProps;
  endIconProps?: SvgProps;
  textInputProps?: TextInputProps;
  helperText?: string;
  placeHolder?: string;
  handleClicEndIcon?: () => void;

}






const Employee_ProfileScreen = () => {
    
    const colors = useAppThemeColor()

    const style = CommonStyle(colors);
  const dispatch = useDispatch()
  const employee = useSelector(state => state.employee.employeeInfos as IFullEmployee);
  const updatingEmployee = useSelector(state => state.employee.updatingEmployee);
  const updateEmployeeSuccess = useSelector(state => state.employee.updateEmployeeSuccess);
  const updatingEmployeeErrorMessage = useSelector(state => state.employee.errorUpdatingEmployee);


  const [editingProfile, setEditingProfile] = useState(false);

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState("")

  const [alertMessage, setAlertMessage] = useState('');

  const [isOperationInProgress, setIsOperationInProgress] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('initialisation...');


  const showAlert = (message: string, title: string = "Erreur de validation") => {
    setAlertMessage(message);
    setAlertVisible(true);
    setAlertTitle(title)
  };

  const closeAlert = () => {
    setAlertVisible(false);
  };


  const { control, handleSubmit, formState: { errors }, setValue, clearErrors, reset } = useForm<EmployeeUpdatable>({
    defaultValues: {
      name: employee.name,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      job: employee.job,
      salary: employee.salary,
      photoURL: employee.photoURL,
      inCompanyId: employee.inCompanyId,
      _id: employee._id,
      codePin: employee.codePin,

    }
  });


  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
        setValue('photoURL', result?.assets[0]?.uri!); // Met à jour la valeur du champ 'image'
          clearErrors('photoURL');
    }
  };

  const profileMenuTextFiledsData = React.useMemo(() => {
    const companyProfileItems: Array<ProfileField> = [
      {
        name: 'codePin',
        label: "Code Pin",
        canEdit: false,
        required: false,
        helperText: "il s'agit de votre code secret, vous ne pouvez ni la voir ni la modifier dans ce formulaire cliquez sur le bouton de modification pour lancer la procédure",
        startIcon: APP_IMAGES.ICON_PASSWORD_FIELD,
        startIconProps: { fillOpacity: 0 },
        endIcon: APP_IMAGES.ICON_EDIT_SECRET,
        endIconProps: { width: 32, height: 32, fill: colors.primary, fillOpacity: 1 },
         handleClicEndIcon: () => router.push('/employee_content/change_pincode'),
        textInputProps: { autoCapitalize: 'none', autoCorrect: false, secureTextEntry: true },
      
       

      },
      {
        name: 'name',
        label: 'Nom Complet',
        helperText: "entrer le nom et le prénom de l'employé",
        required: true,
        rhfRules: {
          required: 'Ce champ est requis',
        },
        canEdit: true,
        startIcon: APP_IMAGES.ICON_FIELD_EMPLOYEE_NAME,
        startIconProps: { fillOpacity: 0 },
        textInputProps: { autoCapitalize: 'characters', autoCorrect: false }

      },
      {
        name: 'inCompanyId',
        label: "Identifiant unique dans l'entreprise",
        canEdit: false,
        required: true,
        rhfRules: {
          required: 'Ce champ est requis',
        },
        helperText: `il s'agit de ce qui vous identify de façon unique chez *${employee.companyId.name}*`,
        startIcon: APP_IMAGES.ICON_FIELD_EMPLOYEE_IN_COMPANY_ID,
      },
      {
        name: 'job',
        label: "Poste Occupé",
        canEdit: false,
        required: true,
        rhfRules: {
          required: 'Ce champ est requis',
        },
        helperText: ` il s'agit du poste que vous occupé à *${employee.companyId.name}*`,
        startIcon: APP_IMAGES.ICON_FIELD_EMPLOYEE_JOB,
        startIconProps: { fillOpacity: 1 },
        textInputProps: { autoCapitalize: 'words', autoCorrect: false }


      },
      {
        name: 'salary',
        label: "Salaire",
        canEdit: false,
        required: true,

        helperText: "il s'agit de votre salaire, elle est utilisé pour définir le montant maximum que vous pouvez empruntez, contactez votre entreprise si ce salaire est incorrect",
        startIcon: APP_IMAGES.ICON_FIELD_EMPLOYEE_SALARY,
        textInputProps: { keyboardType: 'numeric', autoCapitalize: 'none', autoCorrect: false }
      },

      {
        name: 'phoneNumber',
        label: "Téléphone",
        canEdit: true,
        required: true,
        rhfRules: {
          required: 'Ce champ est requis',
          pattern: { value: cameroonPhoneRegex, message: 'Ce numéro de téléphone n\'est pas camerounais' },
        },
        placeHolder: 'numéro de téléphone',
        helperText: "ce numero sera utiliser par l'application pour vous joindre",
        startIcon: APP_IMAGES.ICON_FIELD_EMPLOYEE_PHONE_NUMBER,
        textInputProps: { keyboardType: 'number-pad', autoCapitalize: 'none', autoCorrect: false }
      },
      {
        name: 'email',
        label: 'Email',
        rhfRules: {
          required: 'Ce champ est requis',
          pattern: { value: emailRegex, message: 'Email invalide' },
        },
        canEdit: true,
        required: true,
        helperText: "l'adresse email sur laquelle vous recevrez les notifications",
        startIcon: APP_IMAGES.ICON_EMAIL_FIELD,
        textInputProps: { keyboardType: 'email-address', autoCapitalize: 'none', autoCorrect: false }
      },




    ]

    return companyProfileItems
  }, [])

  useEffect(() => {
    reset({
      name: employee.name,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      job: employee.job,
      photoURL: employee.photoURL,
      salary: employee.salary,
      inCompanyId: employee.inCompanyId,
      _id: employee._id,
      codePin: employee.codePin,
      companyId: employee.companyId._id,
    })
  }, [employee])

  useEffect(() => {
    if (updateEmployeeSuccess) {
      setEditingProfile(false)
      dispatch(employeeActions.resetUpdatingEmployee())
      showAlert("Vos informations on étés modifier avec succès", 'update Success')
    }
    if (updatingEmployeeErrorMessage && updatingEmployee === false) {
      showAlert(updatingEmployeeErrorMessage!, 'update ERROR')
    }
  }, [updateEmployeeSuccess, updatingEmployeeErrorMessage])

  const uploadToFirebase = async (photoCloudPath: string, imageURI: string): Promise<UploadEmployeeImageToFirebaseCompleted> => {
    setIsOperationInProgress(true);
  
    const reference = ref(storage, photoCloudPath);
    // Convertir l'image en un blob
    const response = await fetch(imageURI);
    const blob = await response.blob();
  
    const uploadTask = uploadBytesResumable(reference, blob);
  
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Calculer la progression en pourcentage
          const uprogress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setStatusMessage(`Upload de la photo ${uprogress.toFixed(2)}% terminée`);
          setProgress(uprogress / 2);
        },
        (error) => {
          // Gérer les erreurs ici
          console.error('Error uploading image: ', error);
          setStatusMessage('Upload failed!');
          setIsOperationInProgress(false);
          reject(error);
        },
        () => {
          // Gérer le succès complet ici
          setIsOperationInProgress(false);
          setStatusMessage('Upload de la photo terminée');
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setValue('photoURL', url);
            const data: UploadEmployeeImageToFirebaseCompleted = {
              photoCloudPath,
              photoURL: url,
            };
            resolve(data);
          }).catch((error) => {
            reject(error);
          });
        }
      );
    });
  };
  
  const onUpdate = async (data: EmployeeUpdatable) => {
    try {
      let photoData: UploadEmployeeImageToFirebaseCompleted = {
        photoCloudPath: employee.photoCloudPath!,
        photoURL: data.photoURL,
      };
  
      if (data.photoURL !== 'none' && !data.photoURL.includes('https://')) {
        // Attendre que l'upload soit terminé et récupérer les informations
        photoData = await uploadToFirebase(data.name, data.photoURL);
      }
  
      const formatedData: Partial<EmployeeUpdatable> = {
        name: data.name.trim(),
        email: data.email.trim(),
        phoneNumber: data.phoneNumber,
        photoCloudPath: photoData.photoCloudPath,
        photoURL: photoData.photoURL,
        salary: data.salary.trim(),
        job: data.job.trim(),
        inCompanyId: data.inCompanyId?.trim(),
        companyId: data.companyId,
      };
  
      const updateFormatedData: IUpdateEmployeeRequest = {
        id: data._id,
        data: formatedData,
      };
  
      dispatch(employeeActions.updateEmployeeRequest(updateFormatedData));
    } catch (error) {
      console.error(error);
      showAlert(`Echec de mise à jour ${error}`, employee.name);
    }
  };
  




  return (
    <View style={{ ...style.page, padding: 5, margin: 0, paddingVertical: 0, paddingHorizontal: 0 }} >

      <View style={[{ flex: 1, padding: 10, margin: 0 }]}>
        <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.background, padding: 5, }}>
          <TouchableOpacity onPress={() => router.back()}>
            <APP_IMAGES.ARROW_BACK_ICON width={32} height={32} fill={colors.primary} />
          </TouchableOpacity>
          <Text style={{ ...fonts.header, fontSize: 30, color: colors.primary, flex: 1, textAlign: 'center' } as any}>Profil</Text>
          <View style={{ flexDirection: 'row', width: 'auto', justifyContent: 'center', alignItems: 'flex-end', gap: 5 }}>
            <APP_IMAGES.LOGO width={32} height={32} />
            {/* <Text style={{ ...APP_FONTS.title, color: APP_COLORS.primary } as TextStyle}>Money Loaner</Text> */}
          </View>
        </View>
        <ScrollView contentContainerStyle={{ padding: 10 }} showsVerticalScrollIndicator={false} stickyHeaderHiddenOnScroll={true} stickyHeaderIndices={[0]} >

          <View style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 'auto', gap: 5 }}>
              <Text style={{ ...fonts.bodyHighLight, color: colors.primary, fontSize: 20 } as TextStyle}>{employee.companyId.name}</Text>
              <Image source={{ uri: employee.companyId.logoURL }} width={32} height={32} />
            </View>
          </View>

          <TouchableOpacity disabled={editingProfile} onPress={() => setEditingProfile(true)}>
            <View style={{ backgroundColor: editingProfile ? Color(colors.primary).alpha(0.5).toString() : colors.primary, borderRadius: 10, flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center', gap: 10 }} >
              <Text style={{ ...fonts.bodyHighLight, color: colors.white } as TextStyle}>Modifier vos informations ?</Text>
              <APP_IMAGES.ICON_PEN fill={colors.white} />
            </View>
          </TouchableOpacity>


          <Controller
            control={control}
            name="photoURL"
            // rules={{ required: 'Votre logo est votre identité aux yeux de vos employés et du monde. Ne l\'oubliez pas' }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={{ ...style.flexCenter, marginBottom: 2, padding: 15, position: 'relative', borderWidth: 1, borderRadius: 10, borderColor: (errors.photoURL ? colors.danger : 'transparent') }}>
                <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', gap: 5 }}>
                  {editingProfile ? <TouchableOpacity disabled={!editingProfile} onPress={pickImage}>
                    <View style={{ backgroundColor: !editingProfile ? Color(colors.primary).alpha(0.5).toString() : colors.primary, borderRadius: 10, flexDirection: 'row-reverse', padding: 10, gap: 10, alignItems: 'center' }} >
                      <Text style={{ ...fonts.bodyHighLight, color: colors.white } as TextStyle}>Modifier la photo de profile</Text>
                      <APP_IMAGES.ICON_CLOUD width={32} height={32} fill={colors.white} />
                    </View>
                  </TouchableOpacity> : <Text>votre photo</Text>}
                  {value != null && value != 'none' ? <Image source={{ uri: value }} style={{ borderRadius: 100 }} width={64} height={64} /> :
              <View style={{borderRadius:100, padding:0, height:48, width:48}} ><APP_IMAGES.ICON_FIELD_EMPTY_EMPLOYEE height={48} width={48} fill={colors.background}  /></View> }
                </View>

                {errors.photoURL && (
                  <TouchableOpacity onPress={() => showAlert(errors?.photoURL?.message!)} style={{ backgroundColor: colors.danger, position: "absolute", right: 0, top: 0, borderTopRightRadius: 10, borderBottomLeftRadius: 10 }}>
                    <APP_IMAGES.ICON_ALERT width={32} height={32} />
                  </TouchableOpacity>
                )}

              </View>
            )}
          />


          <View>
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={{ paddingVertical: 10, gap: 30 }}
              data={profileMenuTextFiledsData}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <Controller
                  control={control}
                  name={item.name}
                  rules={item?.rhfRules}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <ProfileTextField
                      placeholder={item.placeHolder || item.name}
                      svgStartIcon={item.startIcon}
                      startIconProps={{ fillOpacity: 0.6, ...item.startIconProps }}
                      svgEndIcon={item.endIcon}
                      endIconProps={item.endIconProps}
                      onChange={onChange}
                      onBlur={onBlur}
                      helperText={item.helperText}
                      value={value?.toString()}
                      required={item.required}
                      textInputProps={item.textInputProps}
                      error={errors[item.name]?.message}
                      canEdit={editingProfile && item.canEdit}
                      label={item.label}
                      handleClicEndIcon={item.handleClicEndIcon}
                    />
                  )}
                />
              )}
            />


          </View>
          <View>
            {updateEmployeeSuccess == false && <Text>{updatingEmployeeErrorMessage}</Text>}
          </View>



          {editingProfile && <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', borderRadius: 10 }}>
            <TouchableOpacity onPress={() => {
              reset()
              setEditingProfile(false)
            }}
              disabled={updatingEmployee === true || isOperationInProgress}

            >
              <View style={{ backgroundColor: updatingEmployee === true || isOperationInProgress ? colors.background : colors.white, width: 113, height: 82, borderRadius: 10, padding: 10, gap: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.primary }} >
                <APP_IMAGES.ICON_PEN_CANCEL width={32} height={32} stroke={colors.secondary} />
                <Text style={{ ...fonts.bodyHighLight, color: colors.secondary } as TextStyle}>Annuler</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit(onUpdate)} disabled={updatingEmployee! || isOperationInProgress}>
              <View style={{ backgroundColor: updatingEmployee === true || isOperationInProgress ? colors.white : colors.primary, width: 113, height: 82, borderRadius: 10, padding: 10, gap: 10, justifyContent: 'center', alignItems: 'center' }} >
                {updatingEmployee === true || isOperationInProgress ? <ActivityIndicator size={'large'} color={colors.primary} /> : <View><APP_IMAGES.ICON_PEN fill={colors.white} />
                  <Text style={{ ...fonts.bodyHighLight, color: colors.white } as TextStyle}>Enregistrer</Text></View>}
              </View>
            </TouchableOpacity>
          </View>}

          <View style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 5, flexWrap: 'wrap',
            justifyContent: "center", alignItems: 'center', marginBottom: 10, marginTop: 20
          }}>
            <Text style={{ ...fonts.bodymin, color: 'black' } as any} >Veuillez consulter la </Text>
            <Links.Primary title='politique de confidentialité' onPress={() => Alert.alert('politique de confidentialité...')} />
            <Text style={{ ...fonts.bodymin, color: 'black' } as any} > et les </Text>
            <Links.Primary title="conditions d'utilisations" onPress={() => Alert.alert("conditions d'utilisation...")} />
          </View>

          <View style={style.flexCenter}>
            <TouchableOpacity onPress={() => {

              Alert.alert("Quitter l'application", "Êtes-vous sûr de vouloir fermer l'application?", [
                {
                  text: "Annuler",
                  onPress: () => null,
                  style: "cancel"
                },
                {
                  text: "Oui", onPress: () => router.replace("/logout")
                }
              ]);


            }}
              style={{ flexDirection: 'row', gap: 10, width: 255, height: 45, borderRadius: 10, padding: 5, borderColor: colors.primary, alignItems: 'center', borderWidth: 1, marginBottom: 10 }}>
              <APP_IMAGES.ICON_LOGOUT width={48} height={48} stroke={colors.primary} strokeOpacity={0.6} />
              <Text style={{ ...fonts.bodyHighLight, fontSize: 20, color: Color(colors.primary).alpha(0.6).toString() } as TextStyle}>Se Déconnecter</Text>
            </TouchableOpacity>

          </View>

        </ScrollView>
        <CustomAlert
          visible={alertVisible}
          title={alertTitle}
          message={alertMessage}
          onClose={closeAlert}
          type='error'
        />
        {isOperationInProgress && (
          <CustomStatusBar progress={progress} statusMessage={statusMessage} />
        )}

      </View>



    </View>
  );
};


export default Employee_ProfileScreen;
