import CompanyCustomDrawerContent from "@/components/Drawer/CompanyCustomDrawerContent";
import DrawerHeader from "@/components/Headers/DrawerHeader";
import RessourceHeader from "@/components/Headers/RessourceHeader";
import APP_IMAGES from "@/constants/images";
import { useSelector } from "@/hooks/useSelector";
import { useAppThemeColor } from "@/hooks/useThemeColor";

import { router} from "expo-router";
import { Drawer } from "expo-router/drawer";
import { ICompany } from "money-loaner-api-types";


export default function CompanyRoute() {
  const colors = useAppThemeColor();
  const company = useSelector((state) => state.company.companyInfos);

  return (
    <Drawer
    drawerContent={(props)=>CompanyCustomDrawerContent(props)}
      screenOptions={{
        header: (d) => (
         <DrawerHeader onClicRight={()=>router.push("/company_content/profile")} showAppName entity={company as any} drawerHeaderProps={d} colors={colors} appName="Money Loaner"/>
        ),
      }}
    >
      <Drawer.Screen name="index" options={{
        title:"Acceuil",
        drawerIcon: (props)=><APP_IMAGES.ICON_HOME height={48} width={48}/>,
      }}/>
      <Drawer.Screen name="add_employee" options={{
        drawerItemStyle:{display:"none"},
       headerShown:false,
        }} />
      <Drawer.Screen name="update_employee" options={{drawerItemStyle:{display:"none"}}} />
      <Drawer.Screen
       options={{
         title:"Gestion des employés",
         drawerIcon: (props)=><APP_IMAGES.EMPLOYEE_IMAGE height={48} width={48}/>,
        header: (d) => <RessourceHeader appName="Gestion des employés" colors={colors}/>
      }}
       name="gestion_employee" />
      <Drawer.Screen name="profile" options={{drawerItemStyle:{display:"none"},headerShown:false}} /> 
      <Drawer.Screen 
      options={{
        title:"Gestion des prets",
        drawerIcon: (props)=><APP_IMAGES.ICON_LOAN_GESTION stroke={colors.primary} height={48} width={48}/>,
        header: (d) => <RessourceHeader appName="Gestion des prèts" colors={colors}/>
      }}
       name="gestion_prets"
      

        />
      <Drawer.Screen name="repay"
       options={{
        drawerItemStyle:{display:"none"},
        header: (d) => <RessourceHeader appName="Rembourssement" colors={colors}/>
        }} />

        <Drawer.Screen
          options={{
            title:"Paramètres",
            drawerIcon: (props)=><APP_IMAGES.ICON_SETTING stroke={colors.primary} height={48} width={48}/>,
            header: (d) => <RessourceHeader appName="paramètres" colors={colors}/>
          }}
         name="settings"
        
        />
    </Drawer>

  );
}
