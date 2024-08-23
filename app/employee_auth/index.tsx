/* eslint-disable prettier/prettier */
import React from 'react';
import Buttons from "@/components/Buttons";
import SelectCompany from "@/components/Buttons/SelectCompany";
import Links from "@/components/Links";
import fonts from "@/constants/fonts";
import APP_IMAGES from "@/constants/images";
import { useSelector } from "@/hooks/useSelector";
import { useAppThemeColor } from "@/hooks/useThemeColor";
import CommonStyles from "@/styles/common";
import { router } from "expo-router";
import { Alert, SafeAreaView, Text, View } from "react-native";






const Employee_ChooseCompanyScreen= () => {
    const colors = useAppThemeColor()
    const style = CommonStyles(colors);


const selectedCompany = useSelector(state=>state.auth.selectedCompany)

  return (
    <View style={style.page}>
      <View style={style.Headerblock}>
        <APP_IMAGES.LOGO width={48} height={54} />
        <Text style={style.HeaderText}>Money Loaner</Text>
      </View>

      <View style={{ ...style.flexCenter, gap: 0 }}>
        <APP_IMAGES.EMPLOYEE_CHOOSE_COMPANY_IMAGE width={210} height={240} />
        <Text style={{ ...fonts.header, color: 'black', textAlign: 'center' } as any}>Gestion de l'employé </Text>
        <Text style={{ ...fonts.bodymin, color: 'black', textAlign: 'center', width: 310 } as any}>
          Effectuez des prêts vers votre entreprise en toute simplicité 🚀
        </Text>
      </View>

      {/** Zone des boutons */}
      <SelectCompany enterpriseLogoURL={selectedCompany?.logoURL} enterpriseName={selectedCompany?.name}  onPress={() => router.push("/list_company")} />

      <View style={{ display: 'flex', gap: 10 }}>
        <Buttons.Primary disabled={!selectedCompany} onPress={()=>router.push("/employee_auth/identify")} />
        <Buttons.Previous onPress={() => router.back()} />
      </View>

      <View style={{ display: 'flex', flexDirection: 'row', gap: 5, marginTop: 5 }}>
        <Text style={{ ...fonts.bodymin, color: 'black' } as any}>Vous ne trouvez pas le vôtre?</Text>
        <Links.Primary title='Invité le chef' onPress={() => Alert.alert('envoyer un email au boss...')} />
      </View>
    </View>
  );
};

export default Employee_ChooseCompanyScreen;
