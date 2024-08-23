import CustomDrawerContent from "@/components/Drawer/EmployeeCustomDrawerContent";
import DrawerHeader from "@/components/Headers/DrawerHeader";
import APP_IMAGES from "@/constants/images";
import { useSelector } from "@/hooks/useSelector";
import { useAppThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";

export default function EmployeeRoute() {
  const colors = useAppThemeColor();
  const employee = useSelector((state) => state.employee.employeeInfos);
  return (
    <Drawer
    drawerContent={(props)=>CustomDrawerContent(props)}
      screenOptions={{
        header: (d) => (
          <DrawerHeader
            onClicRight={() => router.push("/employee_content/profile")}
            entity={employee as any}
            drawerHeaderProps={d}
            colors={colors}
            appName="Money Loaner"
            showAppName
          />
        ),
      }}
    >
      <Drawer.Screen name="index" 
      options={{ 
        title: "Acceuil",
        drawerIcon: (props)=><APP_IMAGES.ICON_HOME height={48} width={48}/>,
         }} />
      <Drawer.Screen
        options={{ drawerItemStyle: { display: "none" } }}
        name="change_pincode"
      />
      <Drawer.Screen name="history"  options={{
        title:"Voir l'historique",
        drawerIcon: (props)=><APP_IMAGES.ICON_SEE_REPORT height={48} width={48}/>,
            
             header: (d) => (
                <DrawerHeader
                  onClicRight={() => router.push("/employee_content/profile")}
                  entity={employee as any}
                  drawerHeaderProps={d}
                  colors={colors}
                  appName="Money Loaner"
                  
                  title="Historique des prets"
                />)
             }} />
      <Drawer.Screen
        options={{
             headerShown: false,
             drawerItemStyle: { display: "none" },
             }}
        name="profile"
      />
    </Drawer>
  );
}
