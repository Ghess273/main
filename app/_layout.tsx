import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { initializeUser } from '@/backend/firebase/initializeUser'; 
import {app} from '@/firebaseConfig';
import { useColorScheme } from '@/frontend/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require('../frontend/assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [userReady, setUserReady] = useState(false);

  useEffect(() => {
    console.log("⚙️ Firebase App Initialized:", app);

    const initUser = async () => {
      try {
        const uid = await initializeUser();
        console.log("✅ User initialized with UID:", uid);
        setUserReady(true);
      } catch (error) {
        console.error("❌ Error initializing user:", error);
      }
    };

    initUser();
  }, []);

  useEffect(() => {
    if (fontsLoaded && userReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, userReady]);

  if (!fontsLoaded || !userReady) {
    return null; // Keeps splash screen visible until everything is ready
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}