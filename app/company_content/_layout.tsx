import DrawerHeader from "@/components/Headers/DrawerHeader";
import RessourceHeader from "@/components/Headers/RessourceHeader";
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
      screenOptions={{
        header: (d) => (
         <DrawerHeader onClicRight={()=>router.push("/company_content/profile")} company={company as ICompany} drawerHeaderProps={d} colors={colors} appName="Money Loaner"/>
        ),
      }}
    >
      <Drawer.Screen name="index" options={{
        title:"Acceuil"
      }}/>
      <Drawer.Screen name="add_employee" options={{drawerItemStyle:{display:"none"}}} />
      <Drawer.Screen name="update_employee" options={{drawerItemStyle:{display:"none"}}} />
      <Drawer.Screen
       options={{
        header: (d) => <RessourceHeader appName="Gestion des employés" colors={colors}/>
      }}
       name="gestion_employee" />
      <Drawer.Screen name="profile" options={{drawerItemStyle:{display:"none"},headerShown:false}} /> 
      <Drawer.Screen 
      options={{
        header: (d) => <RessourceHeader appName="Gestion des prèts" colors={colors}/>
      }}
       name="gestion_prets" />
      <Drawer.Screen name="repay" options={{drawerItemStyle:{display:"none"}}} />
    </Drawer>
  );
}
