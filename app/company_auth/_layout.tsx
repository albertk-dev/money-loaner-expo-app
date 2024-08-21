import { Stack } from "expo-router";


export default function CompanyRoute() {
    return(
        <Stack screenOptions={{headerShown:false}} >
            <Stack.Screen name="index" />
            <Stack.Screen name="login_after_register" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
        </Stack>
    )
}