/* eslint-disable prettier/prettier */
import { View, Text, SafeAreaView, ScrollView, FlatList, TouchableOpacity, ActivityIndicator, Alert, TextInputProps, TextStyle, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';
import { ICompany, IEmployee } from 'money-loaner-api-types';
import { companyActions } from '../../redux/company/company.slice';
import ProfileTextField from '../../components/TextField/ProfileTextField';
import { SvgProps } from 'react-native-svg';
import CustomAlert from '../../components/CustomAlert';
import CustomStatusBar from '../../components/CustomStatusBar';
import { cameroonPhoneRegex, emailRegex } from '../../constants/regExp';
import { useSelector } from '../../hooks/useSelector';
import { useDispatch } from 'react-redux';
import fonts from '../../constants/fonts';
import APP_IMAGES from '../../constants/images';
import CommonStyle from '../../styles/common';
import { useAppThemeColor } from '@/hooks/useThemeColor';
import { router,  useLocalSearchParams } from 'expo-router';
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from '@/firebaseConfig';

type ProfileField = {
    name: keyof EmployeeUpdatable;
    label: string;
    required?: boolean;
    rhfRules?: any;
  canEdit?: boolean | true;
    startIcon?: React.FC<SvgProps>;
    endIcon?: React.FC<SvgProps>;
    startIconProps?: SvgProps;
    endIconProps?: SvgProps;
    textInputProps?: TextInputProps;
    helperText?: string;
    placeHolder?: string;
  
  }

type EmployeeUpdatable = Omit<IEmployee,'codePin' | 'updatedAt' | "employees">

 export type UploadEmployeeImageToFirebaseCompleted = {
  photoCloudPath: string;
  photoURL: string;
}



const validateSalary = (value:string) => {
  if (isNaN(Number(value))) {
    return("Le salaire doit etre un nombre")
  }
  if (Number(value) % 50 !== 0) {
    return("Le salaire doit etre un multiple de 50")
  }
  return true
}


const Company_UpdateEmployeeScreen = () => {

    const {data} = useLocalSearchParams()
    const [employeeToUpdate, setEmployeeToUpdate] = useState<EmployeeUpdatable>(JSON.parse(data as string))
   
   


    useEffect(()=>{
      if (data) {
        setEmployeeToUpdate(JSON.parse(data as string))
      }
      
    },[data])
  
    const colors = useAppThemeColor()
    const style = CommonStyle(colors);


  const company = useSelector(state => state.company.companyInfos as ICompany);
  const updatingEmployee = useSelector(state => state.company.updatingEmployee);
  const updateEmployeeSuccess = useSelector(state => state.company.updateEmployeeSuccess);
  const updateEmployeeErrorMsg = useSelector(state => state.company.errorUpdatingEmployee);
  const [employeeUpdated, setEmployeeUpdated] = useState<string>("")


    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("")

  const [alertMessage, setAlertMessage] = useState('');

  const [isOperationInProgress, setIsOperationInProgress] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
 
  const [statusMessage, setStatusMessage] = useState<string>('initialisation...');

    const showAlert = (message: string, title:string = "Erreur de validation") => {
        setAlertMessage(message);
        setAlertVisible(true);
        setAlertTitle(title)
    };

    const closeAlert = () => {
        setAlertVisible(false);
    };

  const dispatch = useDispatch()
  
    const { control, handleSubmit, formState: { errors, isDirty, isSubmitting}, setValue, clearErrors, reset, trigger } = useForm<EmployeeUpdatable>({
        defaultValues: {
        companyId: company._id,
        photoURL: employeeToUpdate?.photoURL,
        name: employeeToUpdate?.name,
        job: employeeToUpdate?.job,
        salary: employeeToUpdate?.salary,
        inCompanyId: employeeToUpdate?.inCompanyId,
        phoneNumber: employeeToUpdate?.phoneNumber,
        email:employeeToUpdate?.email,

      }
    });
    
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        if (!result.canceled) {
            setValue('photoURL', result?.assets[0]?.uri!); // Met à jour la valeur du champ 'image'
              clearErrors('photoURL');
        }
      };
    
  

const uploadToFirebase = async (photoCloudPath : string,imageURI:string): Promise<any> => {
    setIsOperationInProgress(true)
      
    const reference = ref(storage, photoCloudPath);
    // Convertir l'image en un blob
const response = await fetch(imageURI);
const blob = await response.blob();

const uploadTask = uploadBytesResumable(reference, blob)

uploadTask.on(
    'state_changed',
    (snapshot) => {
      // Calculer la progression en pourcentage
      const uprogress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      setStatusMessage(`${uprogress.toFixed(2)}% terminée`)
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
    
      
        setIsOperationInProgress(false)
        setStatusMessage('Upload de la photo terminée');
        getDownloadURL(uploadTask.snapshot.ref).then((url)=>{
            setValue('photoURL', url)

            const data: UploadEmployeeImageToFirebaseCompleted = { photoCloudPath, photoURL: url }
          return data;
        });
    }
  );
  };


    const removeImage = () => {
        setValue("photoURL", '');
        trigger('photoURL');
    };

    const profileMenuTextFiledsData = React.useMemo(() => {
        const companyProfileItems:Array<ProfileField> = [
          {
            name: 'name',
            label: 'Nom Complet',
            helperText:"entrer le nom et le prénom de l'employé",
            required: true,
            rhfRules:{
              required: 'Ce champ est requis',
          },
            canEdit:true,
                startIcon: APP_IMAGES.ICON_FIELD_EMPLOYEE_NAME,
            startIconProps: { fillOpacity: 0 },
            textInputProps:{autoCapitalize:'characters', autoCorrect:false}
          
            },
            {
                name: 'inCompanyId',
                label: "Identifiant unique dans l'entreprise",
                canEdit: true,
              required: true,
              rhfRules:{
                required: 'Ce champ est requis',
            },
                helperText: "il peut s'agir d'un matricule ou du numéro de CNI..toutes choses qui identifie de facon unique cet employé dans l'entreprise",
                startIcon: APP_IMAGES.ICON_FIELD_EMPLOYEE_IN_COMPANY_ID,
              },
          {
            name: 'job',
            label: "Poste Occupé",
            canEdit: true,
            required: true,
            rhfRules:{
              required: 'Ce champ est requis',
          },
            helperText: "Le poste occupé par cet employé dans l'entreprise",
            startIcon: APP_IMAGES.ICON_FIELD_EMPLOYEE_JOB,
            startIconProps: { fillOpacity: 1 },
            textInputProps:{autoCapitalize:'words', autoCorrect:false}
           
         
            },
            {
                name:'salary',
                label: "Salaire",
                canEdit: true,
              required: true,

              rhfRules:{
                required: 'Ce champ est requis',
                validate: validateSalary
            },
                helperText: "Entrez le salaire de votre employé, ceci permettra de définir par la suite le montant exact que celui-ci peut emprunté",
              startIcon: APP_IMAGES.ICON_FIELD_EMPLOYEE_SALARY,
              textInputProps:{keyboardType:'numeric',autoCapitalize:'none', autoCorrect:false}
              },
          
          {
            name: 'phoneNumber',
            label: "Téléphone",
            canEdit: true,
            required: true,
            rhfRules:{
              required: 'Ce champ est requis',
              pattern: { value: cameroonPhoneRegex, message: 'Ce numéro de téléphone n\'est pas camerounais' },
          },
            placeHolder:'numéro de téléphone',
            helperText: "il s'agit du numéro de téléphone de l'employé, il sera  proposer par défaut lors des demandes de pret",
            startIcon: APP_IMAGES.ICON_FIELD_EMPLOYEE_PHONE_NUMBER,
            textInputProps:{keyboardType:'number-pad',autoCapitalize:'none', autoCorrect:false}
          },
          {
            name: 'email',
            label: 'Email',
            rhfRules:{
              required: 'Ce champ est requis',
              pattern: { value: emailRegex, message: 'Email invalide' },
          },
            canEdit:true,
            required: true,
            helperText: "entre l'adresse email de l'entreprise ou celui de son représentant, des notification y seront envoyés",
            startIcon: APP_IMAGES.ICON_EMAIL_FIELD,
            textInputProps:{keyboardType:'email-address',autoCapitalize:'none', autoCorrect:false}
          },
         
         
       
    
        ]
    
        return companyProfileItems
      },[])
 
  
  
  const onUpdateEmployee = async (data: EmployeeUpdatable) => {
    
    let photoData: UploadEmployeeImageToFirebaseCompleted = {
      photoCloudPath: employeeToUpdate?.photoCloudPath!,
      photoURL: data.photoURL
    }
    if (data.photoURL !== 'none' && !data.photoURL.includes('https://') ) {
      await uploadToFirebase(data.name, data.photoURL);

    }
   
    const formatedData: Partial<EmployeeUpdatable> = {
      name: data.name.trim(),
      email: data.email.trim(),
      phoneNumber: data.phoneNumber,
      photoCloudPath: employeeToUpdate?.photoCloudPath,
      photoURL: photoData.photoURL,
      salary: data.salary.trim(),
      job: data.job.trim(),
      inCompanyId: data.inCompanyId?.trim(),
      companyId:company._id,
    }
    setEmployeeUpdated(data.name)
    
    dispatch(companyActions.updateEmployeeRequest({id:employeeToUpdate?._id! , data: formatedData}))
  }


  useEffect(() => {
    if (updateEmployeeSuccess) {
      setIsOperationInProgress(false)
    
        Alert.alert(employeeUpdated, "Employée modifier avec succès", [
          {
            text: "OK", onPress: () => {
              reset()
              dispatch(companyActions.resetUpdatingEmployee())
              dispatch(companyActions.getEmployeesrequest({companyId:company._id}))
              router.push("/company_content/gestion_employee")
          }}
        ]);
       
      
    }
    if (updateEmployeeErrorMsg && updatingEmployee === false) {
      showAlert(updateEmployeeErrorMsg!,'update ERROR')
    }
  },[updateEmployeeSuccess, updateEmployeeErrorMsg])
  

  return (
  
      <SafeAreaView style={{flex:1, padding:10}}>
        <View style={{ display: 'flex', flexDirection: 'row', padding: 10, height: 64, justifyContent: 'space-between', gap: 5, alignItems: 'center' }}>
        <TouchableOpacity onPress={() => {
          const backAction = () => {
            Alert.alert("Vos modifications seront perdus", "Êtes-vous sûr de vouloir quitter sans enregistrer", [
              {
                text: "Annuler",
                onPress: () => null,
                style: "cancel"
              },
              {
                text: "Oui", onPress: () => {
                  reset()
                  dispatch(companyActions.resetUpdatingEmployee())
                  dispatch(companyActions.getEmployeesrequest({companyId:company._id}))
                  router.push('/company_content/gestion_employee')
              }}
            ]);
            return true;
          };
          if (isDirty) {
            backAction()
          } else {
            router.push('/company_content/gestion_employee')
          }
          
        }}>
                 <APP_IMAGES.ARROW_BACK_ICON width={32} height={32}  fill={colors.primary}/>
          </TouchableOpacity>
   
          <Text style={{...fonts.header, fontSize:24, color:colors.primary, flex:1, textAlign:'center'} as any}>Modifier un employé</Text>
        <APP_IMAGES.LOGO width={48} height={44}/>  
        </View>
        <ScrollView style={{width:'100%', flex:1, marginBottom:40, padding:10}} showsVerticalScrollIndicator={false} contentContainerStyle={{width:"100%"}}>
            <FlatList
              scrollEnabled={false}
              contentContainerStyle={{paddingVertical:10, gap:30}}
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
                        onChange={onChange}
                    onBlur={onBlur}
                    helperText={item.helperText}
                    value={value?.toString()}
                    required={item.required}
                    textInputProps={{autoCapitalize: 'none', autoComplete:'off' ,...item.textInputProps}}
                    error={errors[item.name]?.message}
                    canEdit={ item.canEdit}
                    label={item.label}
                    />
                )}
            />
              )}
              />
              

            <Controller
                        control={control}
                        name="photoURL"
                     //   rules={{ required: 'La photo de votre employée  vous permettra de l\'identifier plus facilement. Ne l\'oubliez pas' }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <View style={{ ...style.flexCenter, marginBottom: 20, width: '100%', padding: 15, position: 'relative', borderWidth: 1, borderRadius: 10, borderColor: (errors.photoURL ? colors.danger : 'transparent') }}>
                                 <View style={{alignItems:'center', justifyContent:'center', flexDirection:'row', gap:20}}>
             {value == null || value=== '' || value === 'none'?<TouchableOpacity  onPress={pickImage}>
            <View style={{backgroundColor: colors.primary, borderRadius:10,flexDirection:'row-reverse', padding:10,gap:10, alignItems:'center'}} >
              <Text style={{...fonts.bodyHighLight, color:colors.white} as TextStyle}>Modifier la photo</Text>
              <APP_IMAGES.ICON_CLOUD  width={32} height={32} fill={colors.white}/>
            </View>
                                    </TouchableOpacity> :
                                    
                                    <TouchableOpacity  onPress={removeImage}>
            <View style={{backgroundColor: colors.white, borderRadius:10,flexDirection:'row-reverse', padding:10,gap:10, alignItems:'center'}} >
              <Text style={{...fonts.bodyHighLight, color:colors.primary} as TextStyle}>Supprimer la photo</Text>
              <APP_IMAGES.ICON_CLOUD  width={32} height={32} fill={colors.primary}/>
            </View>
            </TouchableOpacity>}

                                    {value != null && value!='' && value != 'none' ?<Image source={{ uri: value }} width={100} height={100} /> : <APP_IMAGES.ICON_FIELD_EMPTY_EMPLOYEE width={100} height={100}/>}
                                    
                            </View>
                          
                            

                                {errors.photoURL && (
                                    <TouchableOpacity onPress={() => showAlert(errors?.photoURL?.message!)} style={{ backgroundColor: colors.danger, position: "absolute", right: 0, top: 0, borderTopRightRadius: 10, borderBottomLeftRadius: 10 }}>
                                        <APP_IMAGES.ICON_ALERT width={32} height={32} />
                                    </TouchableOpacity>
                                )}

                            </View>
                        )}
                    />
           
          </ScrollView>
        
          <CustomAlert
                        visible={alertVisible}
                        title={alertTitle}
                        message={alertMessage}
                        onClose={closeAlert}
                        type='error'
        />
            



       
        <KeyboardAccessoryView style={{ paddingVertical: 5, marginBottom: 20, height: 'auto' }} alwaysVisible={true} androidAdjustResize>
                    {({ isKeyboardVisible }) => (
                        <View style={{ gap: 10, justifyContent: 'center', alignItems: 'center' }}>
          


            <TouchableOpacity onPress={handleSubmit(onUpdateEmployee)}  disabled={updatingEmployee! || isOperationInProgress  || isSubmitting}>
              <View style={{ backgroundColor: updatingEmployee===true || isOperationInProgress || isSubmitting ? colors.white :  colors.primary, width: 200, height: 'auto', borderRadius: 10, padding: 10, gap: 10, justifyContent: 'center', alignItems: 'center' }} >
               { updatingEmployee===true || isOperationInProgress || isSubmitting ? <ActivityIndicator size={'large'} color={colors.primary}/> : 
                <Text style={{ ...fonts.title, color: colors.white } as TextStyle}>Modifier l'Employée</Text>}
              </View>
            </TouchableOpacity>
      
                            {isOperationInProgress && (
        <CustomStatusBar progress={progress} statusMessage={statusMessage} />
      )}
                        </View>
          )}
          </KeyboardAccessoryView>
      </SafeAreaView>
  );
};

export default Company_UpdateEmployeeScreen;
