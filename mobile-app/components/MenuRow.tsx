import { Pressable, StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../hooks/useTheme'

export default function MenuRow({
  title,
  subtitle,
  onPress,
  danger,
}: {
  title: string
  subtitle?: string
  onPress: () => void
  danger?: boolean
}) {
  const { colors } = useTheme()
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.card, borderBottomColor: colors.line },
        pressed && { opacity: 0.7 },
      ]}
    >
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: danger ? colors.brand : colors.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.sub, { color: colors.muted }]}>{subtitle}</Text> : null}
      </View>
      <Text style={[styles.chev, { color: danger ? colors.brand : colors.tabInactive }]}>›</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    minHeight: 58,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
  },
  title: { fontWeight: '800', fontSize: 15 },
  sub: { fontSize: 12, marginTop: 2, fontWeight: '600' },
  chev: { fontSize: 28, fontWeight: '300', marginTop: -2 },
})
