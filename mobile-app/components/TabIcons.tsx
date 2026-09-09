import Svg, { Circle, Path, Rect } from 'react-native-svg'

type IconProps = { color: string; size?: number }

export function HomeIcon({ color, size = 26 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" fill={color} />
    </Svg>
  )
}

export function PeopleIcon({ color, size = 26 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="9" cy="8" r="3.1" fill={color} />
      <Path d="M3.5 19.2c.4-3.4 3-5.2 5.5-5.2s5.1 1.8 5.5 5.2c.1.7-.4 1.3-1.1 1.3H4.6c-.7 0-1.2-.6-1.1-1.3Z" fill={color} />
      <Circle cx="16.5" cy="8.2" r="2.5" fill={color} />
      <Path d="M14.2 19.4c.6-2.4 2.3-3.8 4.2-3.8 1.6 0 3 .9 3.6 2.8.2.6-.2 1.1-.8 1.1h-6.3c-.6 0-1-.5-.7-1.1Z" fill={color} />
    </Svg>
  )
}

export function DropIcon({ color, size = 26 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3.2c.2 0 7 7.2 7 12.2A7 7 0 1 1 5 15.4C5 10.4 11.8 3.2 12 3.2Z" fill={color} />
    </Svg>
  )
}

export function BellIcon({ color, size = 26 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M12 3a6 6 0 0 0-6 6v2.2c0 .8-.4 1.6-1.1 2.2L4 14.6c-.6.5-.3 1.4.4 1.4h15.2c.7 0 1-.9.4-1.4l-.9-1.2c-.7-.6-1.1-1.4-1.1-2.2V9a6 6 0 0 0-6-6Z" fill={color} />
      <Path d="M9.6 17.2a2.5 2.5 0 0 0 4.8 0H9.6Z" fill={color} />
    </Svg>
  )
}

export function ProfileIcon({ color, size = 26 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="3.4" fill={color} />
      <Path d="M5 19.4C5.6 15.8 8.2 14 12 14s6.4 1.8 7 5.4c.1.6-.4 1.1-1 1.1H6c-.6 0-1.1-.5-1-1.1Z" fill={color} />
    </Svg>
  )
}

export function SunIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="4" fill={color} />
      <Path d="M12 3v2M12 19v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M3 12h2M19 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  )
}

export function MoonIcon({ color, size = 22 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M16.2 13.4A6.8 6.8 0 0 1 10.6 4.2 8 8 0 1 0 19.8 13a6.7 6.7 0 0 1-3.6.4Z" fill={color} />
    </Svg>
  )
}

export function ChatIcon({ color, size = 26 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M5 5h14a2 2 0 0 1 2 2v8.2a2 2 0 0 1-2 2H10l-4.4 3.2c-.8.6-1.6.1-1.6-.8V7a2 2 0 0 1 2-2Z" fill={color} />
    </Svg>
  )
}

export function MenuIcon({ color, size = 26 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="4" y="6" width="16" height="2.2" rx="1.1" fill={color} />
      <Rect x="4" y="11" width="16" height="2.2" rx="1.1" fill={color} />
      <Rect x="4" y="16" width="16" height="2.2" rx="1.1" fill={color} />
    </Svg>
  )
}
