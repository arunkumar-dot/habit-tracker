'use client'

import { useEffect } from 'react'
import { SplashScreen } from '@capacitor/splash-screen'
import { StatusBar, Style } from '@capacitor/status-bar'
import { Capacitor } from '@capacitor/core'

export function CapacitorInit() {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      SplashScreen.hide()
      StatusBar.setStyle({ style: Style.Light })
      StatusBar.setBackgroundColor({ color: '#FAF8F4' })
    }
  }, [])

  return null
}
