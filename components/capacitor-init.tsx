'use client'

import { useEffect } from 'react'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Capacitor } from '@capacitor/core'

// Only handles StatusBar. SplashScreen is hidden by CapacitorSplashHider
// (inside ClerkProvider) so it only hides once auth state is loaded.
export function CapacitorInit() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Light })
      StatusBar.setBackgroundColor({ color: '#FAF8F4' })
    }
  }, [])

  return null
}
