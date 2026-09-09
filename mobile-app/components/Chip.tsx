import { Pressable, StyleSheet, Text } from 'react-native'
import { radius } from '../constants/theme'
import { useTheme } from '../hooks/useTheme'

export default function Chip({
  label,
  selected,
  onPress,
}: {
  label: string
  selected?: boolean
  onPress: () => void
}) {
  const { colors } = useTheme()
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        { backgroundColor: selected ? colors.brand : colors.card, borderColor: selected ? colors.brand : colors.line },
      ]}
    >
      <Text style={[styles.text, { color: selected ? '#fff' : colors.text }]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 38,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { fontWeight: '800', fontSize: 13 },
})
