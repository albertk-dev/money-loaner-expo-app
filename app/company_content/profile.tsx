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

interface CompanyUpdatable
  extends Omit<
    ICompany,
    "createdAt" | "logoCloudImagePath" | "updatedAt" | "employees"
  > {
  numberOfEmployees: Number;
}

type ProfileField = {
  name: keyof CompanyUpdatable;
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

const Company_ProfileScreen = () => {
  const colors = useAppThemeColor();
  const style = CommonStyle(colors);

  const dispatch = useDispatch();
  const company = useSelector(
    (state) => state.company.companyInfos as ICompany
  );
  const updatingCompany = useSelector((state) => state.company.updatingCompany);
  const updatingCompanySuccess = useSelector(
    (state) => state.company.updateCompanySuccess
  );
  const updatingCompanyErrorMessage = useSelector(
    (state) => state.company.errorUpdatingCompany
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

  const showAlert = (
    message: string,
    title: string = "Erreur de validation"
  ) => {
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
  } = useForm<CompanyUpdatable>({
    defaultValues: {
      name: company.name,
      password: company.password,
      email: company.email,
      numberOfEmployees: company.employees?.length,
      phoneNumber: company.phoneNumber,
      localisation: company.localisation,
      logoURL: company.logoURL,
      socialId: company.socialId,
      _id: company._id,
    },
  });

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setValue("logoURL", result?.assets[0]?.uri!); // Met à jour la valeur du champ 'image'
      clearErrors("logoURL");
    }
  };

  const profileMenuTextFiledsData = React.useMemo(() => {
    const companyProfileItems: Array<ProfileField> = [
      {
        name: "name",
        label: "Raison social",
        helperText:
          "il s'agit du nom de votre entreprise celui que tout le monde connait",
        required: true,
        startIcon: APP_IMAGES.ICON_SOCIAL_NAME,
        startIconProps: { fillOpacity: 0 },
      },
      {
        name: "password",
        label: "Mot de passe ",
        canEdit: false,
        required: false,
        helperText:
          "il s'agit de votre mot de passe, vous ne pouvez ni la voir ni la modifier dans ce formulaire clisuez sur le bouton de modification pour lancer la procédure",
        startIcon: APP_IMAGES.ICON_PASSWORD_FIELD,
        startIconProps: { fillOpacity: 0 },
        textInputProps: {
          autoCapitalize: "none",
          autoCorrect: false,
          secureTextEntry: true,
        },
        endIcon: APP_IMAGES.ICON_EDIT_SECRET,
        endIconProps: {
          width: 32,
          height: 32,
          fill: colors.primary,
          fillOpacity: 1,
        },
        handleClicEndIcon: () =>
          Alert.alert("modification du mot de passe lancer..."),
      },
      {
        name: "socialId",
        label: "Identifiant Social",
        canEdit: true,
        required: true,
        helperText:
          "il peut s'agir d'un matricule ou d'un numéro d'arrété...toutes choses qui identifie de facon unique votre entreprise au yeux de l'état ",
        startIcon: APP_IMAGES.ICON_SOCIAL_ID_FIELD,
      },
      {
        name: "phoneNumber",
        label: "Téléphone",
        canEdit: true,
        required: false,
        placeHolder: "numéro de téléphone",
        helperText:
          "il s'agit du numéro de téléphone de votre entreprise, il vous sera proposer par défaut lors des rembourssement",
        startIcon: APP_IMAGES.ICON_PHONE_NUMBER_FIXE_FIELD,
        textInputProps: {
          keyboardType: "phone-pad",
          autoCapitalize: "none",
          autoCorrect: false,
        },
      },
      {
        name: "email",
        label: "Email",
        canEdit: true,
        required: true,
        helperText:
          "entre l'adresse email de l'entreprise ou celui de son représentant, des notification y seront envoyés",
        startIcon: APP_IMAGES.ICON_EMAIL_FIELD,
        textInputProps: {
          keyboardType: "email-address",
          autoCapitalize: "none",
          autoCorrect: false,
        },
      },
      {
        name: "localisation",
        label: "Localisation",
        canEdit: true,
        required: false,
        helperText: "il s'agit de votre adresse ville-quatier-rue-num",
        startIcon: APP_IMAGES.ICON_LOCALISATION_FIELD,
      },
      {
        name: "numberOfEmployees",
        label: "Nombre d'employées",
        canEdit: false,
        required: false,
        helperText:
          "il s'agit du nombre d'employées que vous avez ajouté a l'application ",
        startIcon: APP_IMAGES.ICON_NUMBER_OF_EMPLOYEES_FIELD,
      },
    ];

    return companyProfileItems;
  }, []);

  useEffect(() => {
    reset({
      name: company.name,
      password: company.password,
      email: company.email,
      numberOfEmployees: company.employees?.length,
      phoneNumber: company.phoneNumber,
      localisation: company.localisation,
      logoURL: company.logoURL,
      socialId: company.socialId,
      _id: company._id,
    });
  }, [company]);

  useEffect(() => {
    if (updatingCompanySuccess) {
      setEditingProfile(false);
      dispatch(companyActions.clearUpdateData());
    }
    if (updatingCompanyErrorMessage && updatingCompany === false) {
      showAlert(updatingCompanyErrorMessage!, "update ERROR");
    }
  }, [updatingCompanySuccess, updatingCompanyErrorMessage]);

  const uploadToFirebase = async (logoURI: string): Promise<UploadToFirebaseCompleted> => {
    setIsOperationInProgress(true);
  
    const reference = ref(storage, company.logoCloudImagePath);
    // Convertir l'image en un blob
    const response = await fetch(logoURI);
    const blob = await response.blob();
  
    const uploadTask = uploadBytesResumable(reference, blob);
  
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Calculer la progression en pourcentage
          const uprogress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setStatusMessage(`Upload du logo ${uprogress.toFixed(2)}% terminée`);
          setProgress(uprogress / 2);
        },
        (error) => {
          // Gérer les erreurs ici
          console.error("Error uploading image: ", error);
          setStatusMessage("Upload failed!");
          setIsOperationInProgress(false);
          reject(error);
        },
        () => {
          // Upload réussi
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setIsOperationInProgress(false);
            setStatusMessage("Upload du logo terminée");
            setValue("logoURL", url);
  
            const data: UploadToFirebaseCompleted = {
              logoCloudImagePath: company.logoCloudImagePath,
              logoURL: url,
            };
            resolve(data);
          }).catch((error) => {
            setIsOperationInProgress(false);
            reject(error);
          });
        }
      );
    });
  };
  
  const onUpdate = async (data: CompanyUpdatable) => {
    try {
      let logoData: UploadToFirebaseCompleted = {
        logoCloudImagePath: company.logoCloudImagePath,
        logoURL: company.logoURL,
      };
  
      if (data.logoURL !== company.logoURL) {
        // Attendre que l'upload soit terminé et récupérer les informations
        logoData = await uploadToFirebase(data.logoURL);
      }
  
      const updateFormatedData: IUpdateCompanyRequest = {
        id: data._id,
        updateData: {
          ...data,
          logoCloudImagePath: logoData.logoCloudImagePath,
          logoURL: logoData.logoURL,
        },
      };
  
      dispatch(companyActions.updateCompanyRequest(updateFormatedData));
    } catch (error) {
      console.error(error);
      showAlert(`Echec de mise à jour ${error}`, company.name);
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
          <TouchableOpacity onPress={() => router.back()}>
            <APP_IMAGES.ARROW_BACK_ICON
              width={32}
              height={32}
              fill={colors.primary}
            />
          </TouchableOpacity>
          <Text
            style={
              {
                ...fonts.header,
                fontSize: 30,
                color: colors.primary,
                flex: 1,
                textAlign: "center",
              } as any
            }
          >
            Profil
          </Text>
          <View
            style={{
              flexDirection: "row",
              width: "auto",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: 5,
            }}
          >
            <Image source={{ uri: company.logoURL }} width={32} height={32} />
            {/* <APP_IMAGES.LOGO width={32} height={32} /> */}
            {/* <Text style={{ ...APP_FONTS.title, color: APP_COLORS.primary } as TextStyle}>Money Loaner</Text> */}
          </View>
        </View>
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
                Modifier vos informations ?
              </Text>
              <APP_IMAGES.ICON_PEN fill={colors.white} />
            </View>
          </TouchableOpacity>

          <Controller
            control={control}
            name="logoURL"
            rules={{
              required:
                "Votre logo est votre identité aux yeux de vos employés et du monde. Ne l'oubliez pas",
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View
                style={{
                  ...style.flexCenter,
                  marginBottom: 2,
                  width: "100%",
                  padding: 15,
                  position: "relative",
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: errors.logoURL ? colors.danger : "transparent",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    flexDirection: "row",
                    gap: 20,
                  }}
                >
                  {editingProfile ? (
                    <TouchableOpacity
                      disabled={!editingProfile}
                      onPress={pickImage}
                    >
                      <View
                        style={{
                          backgroundColor: !editingProfile
                            ? Color(colors.primary).alpha(0.5).toString()
                            : colors.primary,
                          borderRadius: 10,
                          flexDirection: "row-reverse",
                          padding: 10,
                          gap: 10,
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={
                            {
                              ...fonts.bodyHighLight,
                              color: colors.white,
                            } as TextStyle
                          }
                        >
                          Modifier le logo
                        </Text>
                        <APP_IMAGES.ICON_CLOUD
                          width={32}
                          height={32}
                          fill={colors.white}
                        />
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <Text>logo</Text>
                  )}
                  <Image source={{ uri: value }} width={64} height={64} />
                </View>

                {errors.logoURL && (
                  <TouchableOpacity
                    onPress={() => showAlert(errors?.logoURL?.message!)}
                    style={{
                      backgroundColor: colors.danger,
                      position: "absolute",
                      right: 0,
                      top: 0,
                      borderTopRightRadius: 10,
                      borderBottomLeftRadius: 10,
                    }}
                  >
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
            {updatingCompanySuccess == false && (
              <Text>{updatingCompanyErrorMessage}</Text>
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
                disabled={updatingCompany === true || isOperationInProgress}
              >
                <View
                  style={{
                    backgroundColor:
                      updatingCompany === true || isOperationInProgress
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
                disabled={updatingCompany! || isOperationInProgress}
              >
                <View
                  style={{
                    backgroundColor:
                      updatingCompany === true || isOperationInProgress
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
                  {updatingCompany === true || isOperationInProgress ? (
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

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 5,
              flexWrap: "wrap",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
              marginTop: 20,
            }}
          >
            <Text style={{ ...fonts.bodymin, color: "black" } as any}>
              Veuillez consulter la{" "}
            </Text>
            <Links.Primary
              title="politique de confidentialité"
              onPress={() => Alert.alert("politique de confidentialité...")}
            />
            <Text style={{ ...fonts.bodymin, color: "black" } as any}>
              {" "}
              et les{" "}
            </Text>
            <Links.Primary
              title="conditions d'utilisations"
              onPress={() => Alert.alert("conditions d'utilisation...")}
            />
          </View>

          <View style={style.flexCenter}>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  "Quitter l'application",
                  "Êtes-vous sûr de vouloir fermer l'application?",
                  [
                    {
                      text: "Annuler",
                      onPress: () => null,
                      style: "cancel",
                    },
                    {
                      text: "Oui",
                      onPress: () => router.replace("/logout"),
                    },
                  ]
                );
              }}
              style={{
                flexDirection: "row",
                gap: 10,
                width: 255,
                height: 45,
                borderRadius: 10,
                padding: 5,
                borderColor: colors.primary,
                alignItems: "center",
                borderWidth: 1,
                marginBottom: 10,
              }}
            >
              <APP_IMAGES.ICON_LOGOUT
                width={48}
                height={48}
                stroke={colors.primary}
                strokeOpacity={0.6}
              />
              <Text
                style={
                  {
                    ...fonts.bodyHighLight,
                    fontSize: 20,
                    color: Color(colors.primary).alpha(0.6).toString(),
                  } as TextStyle
                }
              >
                Se Déconnecter
              </Text>
            </TouchableOpacity>
          </View>
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
  );
};

export default Company_ProfileScreen;
