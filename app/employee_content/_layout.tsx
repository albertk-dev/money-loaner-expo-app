import { Drawer } from "expo-router/drawer";


export default function CompanyRoute() {
    return(
        <Drawer>
            <Drawer.Screen name="index" />
            <Drawer.Screen name="change_pin" />
            <Drawer.Screen name="history" />
            <Drawer.Screen name="profile" />
        </Drawer>
    )
}