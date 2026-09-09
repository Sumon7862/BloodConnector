import { StyleSheet, Text, View } from 'react-native'
import { useTheme } from '../hooks/useTheme'
import Logo from './Logo'

export default function BrandMark({
  subtitle,
  light = false,
  size = 'md',
}: {
  subtitle?: string
  light?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const { colors } = useTheme()
  const logo = size === 'lg' ? 56 : size === 'sm' ? 32 : 40
  return (
    <View style={styles.row}>
      <Logo size={logo} />
      <View style={{ flexShrink: 1, paddingBottom: size === 'sm' ? 8 : 4 }}>
        <Text
          style={[
            styles.title,
            { color: light ? '#fff' : colors.text },
            size === 'lg' && { fontSize: 22 },
            size === 'sm' && { fontSize: 17 },
          ]}
        >
          Blood Connector
        </Text>
        {subtitle ? (
          <Text style={[styles.sub, { color: light ? 'rgba(255,255,255,0.72)' : colors.muted }]} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 4, paddingBottom: 10 },
  title: { fontWeight: '800', fontSize: 16, letterSpacing: -0.3 },
  sub: { fontSize: 11, fontWeight: '700', marginTop: 4 },
})
