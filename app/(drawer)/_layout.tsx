import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
      screenOptions={({ navigation }) => ({
        headerShown: true,  // Affiche l'en-tête avec le bouton hamburger
        drawerStyle: {
          backgroundColor: '#e6e6e6',
          width: 240,
        },
        headerLeft: () => (
          <Pressable style={{padding:10}} onPress={() => navigation.toggleDrawer()}>
            <MaterialIcons name="menu" size={32} color="black" />
          </Pressable>
        ),
      })}
      
      >
        <Drawer.Screen
          name="index" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Home',
            title: 'Acceuil',
          }}
        />
        <Drawer.Screen
          name="explore" // This is the name of the page and must match the url from root
          options={{
            drawerLabel: 'Explore',
            title: 'Explorer',
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
