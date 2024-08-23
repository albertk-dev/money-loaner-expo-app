/* eslint-disable prettier/prettier */
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    TextStyle,
    Alert,
    Image,
    ScrollView,
    TextInputProps,
    FlatList,
    ActivityIndicator,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { useForm, Controller } from "react-hook-form";
  import { ICompany, IUpdateCompanyRequest } from "money-loaner-api-types";
  
  import { UploadToFirebaseCompleted } from "../company_auth/register";
  import { companyActions } from "../../redux/company/company.slice";
  
  import ProfileTextField from "../../components/TextField/ProfileTextField";
  import { SvgProps } from "react-native-svg";
  import CustomAlert from "../../components/CustomAlert";
  import CustomStatusBar from "../../components/CustomStatusBar";
  import { useSelector } from "../../hooks/useSelector";
  import Color from "color";
  import { useDispatch } from "react-redux";
  import fonts from "../../constants/fonts";
  import APP_IMAGES from "../../constants/images";
  import CommonStyle from "../../styles/common";
  import Links from "../../components/Links";
  import { useAppThemeColor } from "@/hooks/useThemeColor";
  import { router } from "expo-router";
  import * as ImagePicker from "expo-image-picker";
  import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
  import { storage } from "@/firebaseConfig";
  import { SafeAreaView } from "react-native-safe-area-context";
  
 type SettingsData = {
    maxPercentage:number,
    minAmount:number,
    stepAmount:number,
 }
  
  type ProfileField = {
    name: keyof SettingsData;
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
    handleClicEndIcon?: () => void;
  };
  
  const Company_SettingsScreen = () => {
    const colors = useAppThemeColor();
    const style = CommonStyle(colors);
  
    const dispatch = useDispatch();
    const company = useSelector(
      (state) => state.company.companyInfos as ICompany
    );
    const updatingLoanParam = useSelector((state) => state.company.updatingLoanParam);
    const updatingLoanParamSucces = useSelector(
      (state) => state.company.updateLoanParamSuccess
    );
    const updatingLoanParamErrorMsg = useSelector(
      (state) => state.company.errorUpdatingLoanParam
    );
  
    const [editingProfile, setEditingProfile] = useState(false);
  
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
  
    const [alertMessage, setAlertMessage] = useState("");
  
    const [isOperationInProgress, setIsOperationInProgress] =
      useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [statusMessage, setStatusMessage] =
      useState<string>("initialisation...");
  
    function showAlert(message: string, title: string = "Erreur de validation") {
      setAlertMessage(message);
      setAlertVisible(true);
      setAlertTitle(title);
    };
  
    const closeAlert = () => {
      setAlertVisible(false);
    };
  
    const {
      control,
      handleSubmit,
      formState: { errors },
      setValue,
      clearErrors,
      reset,
    } = useForm<SettingsData>({
      defaultValues: {
        maxPercentage:company.loanParameters.maxPercentage,
        minAmount:company.loanParameters.minAmount,
        stepAmount:company.loanParameters.stepAmount,
      },
    });
  

    const profileMenuTextFiledsData = React.useMemo(() => {
      const companyProfileItems: Array<ProfileField> = [
        {
          name: "maxPercentage",
          label: "Pourcentage Max",
          helperText:
            "il s'agit du pourcentage maximale qu'un employé peut emprunté en fonction de son salaire",
          required: true,
          canEdit:true,
          textInputProps:{
            keyboardType: "decimal-pad"
          }
        },
        {
            name: "minAmount",
            label: "Montant Minimum",
            helperText:
              "il s'agit du montant minimal qu'un employé peut emprunté ",
            required: true,
            canEdit:true,
            textInputProps:{
              keyboardType: "decimal-pad",
              maxLength:3,

            }
          },
          {
            name: "stepAmount",
            label: "Pas du montant",
            helperText:
              "il s'agit du pas de progression du montant en partant du montant min vers le max",
            required: true,
            canEdit:true,
            textInputProps:{
              keyboardType: "decimal-pad"
            }
          },
      ];
  
      return companyProfileItems;
    }, []);
  
    useEffect(() => {
      reset({
        maxPercentage: company.loanParameters.maxPercentage,
        minAmount: company.loanParameters.minAmount,
        stepAmount:company.loanParameters.stepAmount,
      });
    }, [company]);
  
    useEffect(() => {
      if (updatingLoanParamSucces) {
        setEditingProfile(false);
        dispatch(companyActions.clearUpdateData());
      }
      if (updatingLoanParamErrorMsg && updatingLoanParam === false) {
        showAlert(updatingLoanParamErrorMsg!, "update ERROR");
        setEditingProfile(false)
      }
    }, [updatingLoanParamSucces, updatingLoanParamErrorMsg]);
  
 
  
    const onUpdate = async (data: SettingsData) => {
      try {
       
        dispatch(companyActions.updateLoanParamRequest({companyId:company._id, loanParameters:data}))
      } catch (error) {
        console.error(error);
  
        showAlert(`Echec de mis à jour ${error}`, company.name);
      }
    };
  
    return (
      <View
        style={{
          ...style.page,
          padding: 0,
          margin: 0,
          paddingVertical: 0,
          paddingHorizontal: 0,
        }}
      >
        <View style={[{ flex: 1, padding: 10, margin: 0 }]}>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: colors.background,
              borderRadius: 50,
            }}
          >
          
          <ScrollView
            contentContainerStyle={{ gap: 20, paddingTop: 10 }}
            showsVerticalScrollIndicator={false}
          >
            {/* <View style={{alignItems:'center', justifyContent:'center'}}>
               <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center', width:'auto', gap:5}}>
              <Text style={{ ...APP_FONTS.bodyHighLight, color: APP_COLORS.primary, fontSize:20 } as TextStyle}>{company.name}</Text>
              <Image source={{uri: company.logoURL}} width={32} height={32}/>
            </View>
            </View> */}
  
            <TouchableOpacity
              disabled={editingProfile}
              onPress={() => setEditingProfile(true)}
            >
              <View
                style={{
                  backgroundColor: editingProfile
                    ? Color(colors.primary).alpha(0.5).toString()
                    : colors.primary,
                  borderRadius: 10,
                  flexDirection: "row",
                  padding: 10,
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <Text
                  style={
                    { ...fonts.bodyHighLight, color: colors.white } as TextStyle
                  }
                >
                  Modifier les paramètres ?
                </Text>
                <APP_IMAGES.ICON_PEN fill={colors.white} />
              </View>
            </TouchableOpacity>

  
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
                        startIconProps={{
                          fillOpacity: 0.6,
                          ...item.startIconProps,
                        }}
                        onChange={onChange}
                        onBlur={onBlur}
                        helperText={item.helperText}
                        value={value?.toString()}
                        required={item.required}
                        textInputProps={item.textInputProps}
                        error={errors[item.name]?.message}
                        canEdit={editingProfile && item.canEdit}
                        label={item.label}
                        svgEndIcon={item.endIcon}
                        endIconProps={item.endIconProps}
                        handleClicEndIcon={item.handleClicEndIcon}
                      />
                    )}
                  />
                )}
              />
            </View>
            <View>
              {updatingLoanParamSucces == false && (
                <Text>{updatingLoanParamErrorMsg}</Text>
              )}
            </View>
  
            {editingProfile && (
              <View
                style={{ flexDirection: "row", justifyContent: "space-between" }}
              >
                <TouchableOpacity
                  onPress={() => {
                    reset();
                    setEditingProfile(false);
                  }}
                  disabled={updatingLoanParam === true || isOperationInProgress}
                >
                  <View
                    style={{
                      backgroundColor:
                        updatingLoanParam === true || isOperationInProgress
                          ? colors.background
                          : colors.white,
                      width: 113,
                      height: 82,
                      borderRadius: 10,
                      padding: 10,
                      gap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 1,
                      borderColor: colors.primary,
                    }}
                  >
                    <APP_IMAGES.ICON_PEN_CANCEL
                      width={32}
                      height={32}
                      stroke={colors.secondary}
                    />
                    <Text
                      style={
                        {
                          ...fonts.bodyHighLight,
                          color: colors.secondary,
                        } as TextStyle
                      }
                    >
                      Annuler
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSubmit(onUpdate)}
                  disabled={updatingLoanParam! || isOperationInProgress}
                >
                  <View
                    style={{
                      backgroundColor:
                        updatingLoanParam === true || isOperationInProgress
                          ? colors.white
                          : colors.primary,
                      width: 113,
                      height: 82,
                      borderRadius: 10,
                      padding: 10,
                      gap: 10,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {updatingLoanParam === true || isOperationInProgress ? (
                      <ActivityIndicator size={"large"} color={colors.primary} />
                    ) : (
                      <View>
                        <APP_IMAGES.ICON_PEN fill={colors.white} />
                        <Text
                          style={
                            {
                              ...fonts.bodyHighLight,
                              color: colors.white,
                            } as TextStyle
                          }
                        >
                          Enregistrer
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            )}
  
           
  
         
          </ScrollView>
          <CustomAlert
            visible={alertVisible}
            title={alertTitle}
            message={alertMessage}
            onClose={closeAlert}
            type="error"
          />
          {isOperationInProgress && (
            <CustomStatusBar progress={progress} statusMessage={statusMessage} />
          )}
        </View>
        </View>
      </View>
    );
  };
  
  export default Company_SettingsScreen;
  