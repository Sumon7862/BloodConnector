import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg'

/** Transparent vector mark — no background square. */
export default function Logo({ size = 48 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 120 120" fill="none">
      <Defs>
        <LinearGradient id="drop" x1="38" y1="18" x2="86" y2="104" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#ff5a63" />
          <Stop offset="0.45" stopColor="#e11d2d" />
          <Stop offset="1" stopColor="#9f1239" />
        </LinearGradient>
        <LinearGradient id="people" x1="20" y1="16" x2="100" y2="108" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#fb7185" />
          <Stop offset="1" stopColor="#be123c" />
        </LinearGradient>
      </Defs>
      <Circle cx="60" cy="14" r="7.2" fill="url(#people)" />
      <Path d="M48 34c4.4-8 24-8 28.2 0 2.4 4.6-1.6 8.4-6.6 9.2-4.8.8-10.2.8-15 0-5-.8-8.8-4.6-6.6-9.2Z" fill="url(#people)" />
      <Circle cx="18" cy="58" r="7" fill="url(#people)" />
      <Path d="M12 76c1-12 14.5-16 24-9 3.4 2.5 4 7.4.8 10.4-6.2 5.8-18.4 8.6-24.8 1.6-1.6-1.8-1.4-2.2 0-3Z" fill="url(#people)" />
      <Circle cx="102" cy="58" r="7" fill="url(#people)" />
      <Path d="M108 76c-1-12-14.5-16-24-9-3.4 2.5-4 7.4-.8 10.4 6.2 5.8 18.4 8.6 24.8 1.6 1.6-1.8 1.4-2.2 0-3Z" fill="url(#people)" />
      <Path d="M22 96c8 14 28 18 38 8 10 10 30 6 38-8 2.2 8-6 18-18 22-12 4-28 4-40 0-12-4-20-14-18-22Z" fill="url(#people)" />
      <Path d="M86 100c6 4 16 2 20-4 2-3-1-6-4-5-6 2-12 4-16 9Z" fill="url(#people)" />
      <Path d="M96.2 98.2c2.4-1.4 5.4.2 5.6 3 .2 2.4-1.8 4-4 3.8-2.4-.2-4-2.4-3.2-4.6.4-1 .8-1.6 1.6-2.2Z" fill="#e11d2d" />
      <Path
        d="M60 22c.4 0 28 28.6 28 51.2C88 88.6 75.8 101 60 101S32 88.6 32 73.2C32 50.6 59.6 22 60 22Z"
        fill="url(#drop)"
      />
      <Ellipse cx="50" cy="48" rx="8" ry="5" fill="#fff" opacity="0.22" />
      <Path d="M56 52h8v28h-8z" fill="#fff" />
      <Path d="M46 62h28v8H46z" fill="#fff" />
    </Svg>
  )
}
