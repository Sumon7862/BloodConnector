import { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { shadow } from '../constants/theme'
import { loadNotifications } from '../services/notificationService'
import { loadRequests } from '../services/bloodRequestService'
import { matchingRequestsFor } from '../utils/requests'
import { BellIcon, DropIcon, HomeIcon, PeopleIcon, ProfileIcon } from './TabIcons'

const ICONS = {
  index: HomeIcon,
  donors: PeopleIcon,
  requests: DropIcon,
  notifications: BellIcon,
  profile: ProfileIcon,
} as const

const LABELS = {
  index: 'Home',
  donors: 'Donors',
  requests: 'Requests',
  notifications: 'Alerts',
  profile: 'Profile',
} as const

type TabBarProps = {
  state: {
    index: number
    routes: { key: string; name: string }[]
  }
  navigation: {
    emit: (event: { type: 'tabPress'; target: string; canPreventDefault: true }) => { defaultPrevented: boolean }
    navigate: (name: string) => void
  }
}

export default function AppTabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets()
  const { colors, isDark } = useTheme()
  const { user, isLoggedIn } = useAuth()
  const [unread, setUnread] = useState(0)
  const [matches, setMatches] = useState(0)

  useEffect(() => {
    if (!isLoggedIn) {
      setUnread(0)
      setMatches(0)
      return
    }
    loadNotifications().then((list) => setUnread(list.filter((item) => item.unread).length)).catch(() => {})
    loadRequests().then((list) => setMatches(matchingRequestsFor(user, list).length)).catch(() => {})
  }, [isLoggedIn, user])

  const badges: Record<string, boolean> = {
    notifications: unread > 0,
    requests: matches > 0,
  }

  return (
    <View
      style={[
        styles.bar,
        shadow.tab,
        {
          backgroundColor: colors.tabBar,
          paddingBottom: Math.max(insets.bottom, 10),
          borderTopColor: isDark ? 'transparent' : colors.line,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const focused = state.index === index
        const color = focused ? colors.brand : colors.tabInactive
        const Icon = ICONS[route.name as keyof typeof ICONS] || HomeIcon
        const label = LABELS[route.name as keyof typeof LABELS] || route.name
        return (
          <Pressable
            key={route.key}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true })
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name)
            }}
            style={styles.item}
          >
            <View>
              <Icon color={color} />
              {badges[route.name] ? <View style={[styles.dot, { borderColor: colors.tabBar }]} /> : null}
            </View>
            <Text style={[styles.label, { color }]}>{label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 52,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
  },
  dot: {
    position: 'absolute',
    top: -2,
    right: -3,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#e11d2d',
    borderWidth: 1.5,
    borderColor: '#000',
  },
})
