import type { ReactNode } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTheme } from '../hooks/useTheme'
import BrandMark from './BrandMark'

export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: ReactNode
}) {
  const { colors } = useTheme()
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.navyDeep }]} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.hero}>
            <BrandMark light size="lg" subtitle="Request blood · Donate blood" />
            <Text style={styles.heroTitle}>{title}</Text>
            <Text style={styles.heroCopy}>{subtitle}</Text>
          </View>
          <View style={[styles.sheet, { backgroundColor: colors.bg }]}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { flexGrow: 1 },
  hero: { paddingHorizontal: 24, paddingTop: 18, paddingBottom: 28 },
  heroTitle: { color: '#fff', fontSize: 28, fontWeight: '800', marginTop: 22, letterSpacing: -0.4 },
  heroCopy: { color: 'rgba(255,255,255,0.78)', marginTop: 8, lineHeight: 22, fontSize: 15 },
  sheet: {
    flexGrow: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: 40,
  },
})
