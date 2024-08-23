
import Buttons from "@/components/Buttons";
import SelectCompany from "@/components/Buttons/SelectCompany";
import Links from "@/components/Links";
import fonts from "@/constants/fonts";
import APP_IMAGES from "@/constants/images";
import { useSelector } from "@/hooks/useSelector";
import { useAppThemeColor } from "@/hooks/useThemeColor";
import commonStyles from "@/styles/common";
import { router } from "expo-router";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CompanySelectCompanyScreen()  {
    const selectedCompany = useSelector(state=> state.auth.selectedCompany)

    const colors = useAppThemeColor()
    const style = commonStyles(colors)
    
      return (
        <SafeAreaView style={style.page}>
          <View style={{ display: 'flex', gap: 0, justifyContent: 'center', alignItems: 'center' }}>
            <View style={style.Headerblock}>
              <APP_IMAGES.LOGO width={48} height={54} />
              <Text style={style.HeaderText}>Money Loaner</Text>
            </View>
    
            <APP_IMAGES.COMPANY_CHOOSE_COMPANY_IMAGE width={210} height={240} />
          </View>
    
          <View style={{ display: 'flex', gap: 0, justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={{ ...fonts.header, color: 'black', textAlign: 'center' } as any}>Gestion de l'entreprise </Text>
            <Text style={{ ...fonts.bodymin, color: 'black', textAlign: 'center', width: 310 } as any}>Prêt à simplifier la gestion des prêts entre votre entreprise et vos employés? Laissez-nous vous  guider à travers une expérience simple et intuitive. Commencez dès maintenant! 🚀 </Text>
          </View>
    
          {/**Zone des bouttons */}
          <SelectCompany enterpriseLogoURL={selectedCompany?.logoURL} enterpriseName={selectedCompany?.name}  onPress={() => router.push("/list_company")} />
    
          <View style={{ display: 'flex', gap: 10 }}>
            <Buttons.Primary disabled={!selectedCompany} onPress={() => router.push("/company_auth/login")} />
            <Buttons.Previous onPress={() => router.back()} />
          </View>
    
          <View style={{ display: 'flex', flexDirection: 'row', gap: 5, marginTop: 5 }}>
            <Text style={{ ...fonts.bodymin, color: 'black' } as any}>Vous ne trouvez pas le vôtre?</Text>
            <Links.Primary title="Ajoutez-le ici" onPress={() => router.push("/company_auth/register")} />
          </View>
        </SafeAreaView>
      );
    };
    