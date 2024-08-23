import APP_IMAGES from "@/constants/images";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { Text, View } from "react-native";

function CompanyCustomDrawerContent(props : DrawerContentComponentProps, entity?:string  ) {
    return (
      <DrawerContentScrollView {...props}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <APP_IMAGES.COMPANY_CHOOSE_COMPANY_IMAGE width={200} height={200}/>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
    );
  }


  export default CompanyCustomDrawerContent