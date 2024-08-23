import { Stack } from "expo-router";


export default function CompanyRoute() {
    return(
        <Stack screenOptions={{headerShown:false}}>
            <Stack.Screen name="index" />
            <Stack.Screen name="identify" />
            <Stack.Screen name="pincode" />
        </Stack>
    )
}