import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native'
import { radius } from '../constants/theme'
import { useTheme } from '../hooks/useTheme'

type Props = TextInputProps & { label: string; error?: string }

export default function Field({ label, error, style, secureTextEntry, ...props }: Props) {
  const { colors } = useTheme()
  const [hidden, setHidden] = useState(Boolean(secureTextEntry))
  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={[styles.box, { backgroundColor: colors.input, borderColor: error ? colors.brand : colors.inputBorder }]}>
        <TextInput
          placeholderTextColor={colors.tabInactive}
          secureTextEntry={secureTextEntry ? hidden : false}
          style={[styles.input, { color: colors.text }, style]}
          {...props}
        />
        {secureTextEntry ? (
          <Pressable onPress={() => setHidden((value) => !value)} hitSlop={8}>
            <Text style={[styles.toggle, { color: colors.brand }]}>{hidden ? 'Show' : 'Hide'}</Text>
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={[styles.error, { color: colors.brand }]}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 14 },
  label: { fontWeight: '800', marginBottom: 8, fontSize: 13 },
  box: {
    minHeight: 52,
    borderWidth: 1.5,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: { flex: 1, fontSize: 16, paddingVertical: 12 },
  toggle: { fontWeight: '800', fontSize: 13, marginLeft: 8 },
  error: { marginTop: 6, fontSize: 12, fontWeight: '700' },
})
