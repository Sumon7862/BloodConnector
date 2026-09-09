import { StyleSheet, Text, View } from 'react-native'
import { radius } from '../constants/theme'
import { useTheme } from '../hooks/useTheme'

export default function BloodBadge({ type, size = 'md' }: { type?: string; size?: 'sm' | 'md' | 'lg' }) {
  const { colors, isDark } = useTheme()
  if (!type) return null
  const dim = size === 'lg' ? 44 : size === 'sm' ? 28 : 36
  return (
    <View
      style={[
        styles.badge,
        {
          width: dim,
          height: dim,
          borderRadius: radius.sm,
          backgroundColor: isDark ? '#3f1218' : '#fff1f2',
          borderColor: isDark ? '#7f1d1d' : '#fecdd3',
        },
      ]}
    >
      <Text style={[styles.text, { color: colors.brand, fontSize: size === 'lg' ? 14 : 11 }]}>{type}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: { borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  text: { fontWeight: '800' },
})
