import APP_IMAGES from "@/constants/images";
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { Text, View } from "react-native";

function CustomDrawerContent(props : DrawerContentComponentProps ) {
    return (
      <DrawerContentScrollView {...props}>
      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <APP_IMAGES.EMPLOYEE_IMAGE width={100} height={100}/>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
    );
  }


  export default CustomDrawerContent