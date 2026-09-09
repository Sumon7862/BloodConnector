import 'react-native-gesture-handler'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { View } from 'react-native'
import BrandMark from '../components/BrandMark'
import ThemeToggle from '../components/ThemeToggle'
import AppSplash from '../components/AppSplash'
import { AuthProvider, useAuth } from '../hooks/useAuth'
import { ThemeProvider, useTheme } from '../hooks/useTheme'

function header(subtitle: string) {
  return () => (
    <View style={{ paddingTop: 6, paddingBottom: 12 }}>
      <BrandMark light size="sm" subtitle={subtitle} />
    </View>
  )
}

function RootNavigation() {
  const { colors, ready: themeReady } = useTheme()
  const { ready: authReady } = useAuth()

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.header },
          headerTintColor: '#fff',
          headerShadowVisible: false,
          headerTitleAlign: 'left',
          headerBackTitle: '',
          headerRight: () => (
            <View style={{ marginRight: 8 }}>
              <ThemeToggle compact />
            </View>
          ),
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="forgot" options={{ headerShown: false }} />
        <Stack.Screen name="donor/[id]" options={{ headerTitle: header('Donor profile') }} />
        <Stack.Screen name="request-blood" options={{ headerTitle: header('Request blood') }} />
        <Stack.Screen name="edit-profile" options={{ headerTitle: header('Edit profile') }} />
        <Stack.Screen name="settings" options={{ headerTitle: header('Settings') }} />
        <Stack.Screen name="donations" options={{ headerTitle: header('My donations') }} />
        <Stack.Screen name="family" options={{ headerTitle: header('Family & donors') }} />
        <Stack.Screen name="gallery" options={{ headerTitle: header('Gallery') }} />
        <Stack.Screen name="about" options={{ headerTitle: header('About') }} />
        <Stack.Screen name="blood-types" options={{ headerTitle: header('Blood types') }} />
        <Stack.Screen name="+not-found" options={{ headerTitle: header('Not found') }} />
      </Stack>
      <AppSplash ready={themeReady && authReady} />
    </>
  )
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RootNavigation />
      </AuthProvider>
    </ThemeProvider>
  )
}
