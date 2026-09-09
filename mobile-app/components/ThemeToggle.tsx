import { Pressable, StyleSheet, View } from 'react-native'
import { useTheme } from '../hooks/useTheme'
import { MoonIcon, SunIcon } from './TabIcons'

export default function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { isDark, toggle, colors } = useTheme()
  return (
    <Pressable
      onPress={toggle}
      hitSlop={10}
      style={[
        styles.btn,
        compact && styles.compact,
        { backgroundColor: compact ? 'rgba(255,255,255,0.12)' : colors.input, borderColor: colors.line },
      ]}
    >
      {isDark ? <SunIcon color="#fff" size={compact ? 18 : 20} /> : <MoonIcon color={compact ? '#fff' : colors.text} size={compact ? 18 : 20} />}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  compact: { width: 36, height: 36, borderRadius: 18, borderWidth: 0 },
})
