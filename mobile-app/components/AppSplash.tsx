import { useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import * as SplashScreen from 'expo-splash-screen'
import Logo from './Logo'

SplashScreen.preventAutoHideAsync().catch(() => {})

export default function AppSplash({ ready }: { ready: boolean }) {
  const [visible, setVisible] = useState(true)
  const opacity = useRef(new Animated.Value(1)).current

  useEffect(() => {
    if (!ready) return
    SplashScreen.hideAsync().catch(() => {})
    const timer = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 420, useNativeDriver: true }).start(() => setVisible(false))
    }, 1600)
    return () => clearTimeout(timer)
  }, [ready, opacity])

  if (!visible) return null

  return (
    <Animated.View style={[styles.wrap, { opacity }]} pointerEvents="none">
      <LinearGradient colors={['#07101c', '#0b2447', '#3f0d18']} start={{ x: 0.1, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={styles.glow} />
      <Logo size={128} />
      <Text style={styles.title}>Blood Connector</Text>
      <Text style={styles.copy}>Request blood · Donate blood</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(225, 29, 45, 0.22)',
  },
  title: {
    marginTop: 22,
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  copy: {
    marginTop: 8,
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '700',
    letterSpacing: 0.4,
  },
})
