import { Tabs } from 'expo-router'
import { View } from 'react-native'
import BrandMark from '../../components/BrandMark'
import AppTabBar from '../../components/AppTabBar'
import ThemeToggle from '../../components/ThemeToggle'
import { useTheme } from '../../hooks/useTheme'

export default function TabsLayout() {
  const { colors } = useTheme()
  return (
    <Tabs
      tabBar={(props) => <AppTabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: '#fff',
        headerShadowVisible: false,
        headerTitleAlign: 'left',
        headerTitle: () => (
          <View style={{ paddingTop: 6, paddingBottom: 12 }}>
            <BrandMark light size="sm" subtitle="Blood donation network" />
          </View>
        ),
        headerRight: () => (
          <View style={{ marginRight: 12 }}>
            <ThemeToggle compact />
          </View>
        ),
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="donors" options={{ title: 'Donors' }} />
      <Tabs.Screen name="requests" options={{ title: 'Requests' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Alerts' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  )
}
