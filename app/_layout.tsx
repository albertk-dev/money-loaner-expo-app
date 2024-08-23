import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { Provider } from 'react-redux';
import store, { persistor } from '@/redux/setup/store';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaView } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    Montserrat: require('../assets/fonts/Montserrat.ttf'),
    BebasNeue: require('../assets/fonts/BebasNeue.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
  <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <SafeAreaView style={{ flex: 1 }}>
       <Stack>
        <Stack.Screen options={{headerShown:false}} name="index"/>
        <Stack.Screen options={{headerShown:false}}  name="choose_entity"/>
        <Stack.Screen options={{headerShown:false}}   name='company_auth'/>
        <Stack.Screen options={{headerShown:false}}   name='company_content'/>
        <Stack.Screen options={{headerShown:false}}   name='employee_auth'/>
        <Stack.Screen options={{headerShown:false}}   name='employee_content'/>
        <Stack.Screen options={{headerShown:false}}   name='list_company'/>
        <Stack.Screen options={{headerShown:false}}    name='logout'/>
     
      </Stack>
    </SafeAreaView >
     
    </ThemeProvider>
      </PersistGate>
      
    </Provider>
  
  );
}
