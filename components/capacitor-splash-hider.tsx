'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { SplashScreen } from '@capacitor/splash-screen'
import { Capacitor } from '@capacitor/core'

// Hides the native splash screen only after Clerk has determined auth state,
// preventing the black WebView flash on cold launch and relaunch.
export function CapacitorSplashHider() {
  const { isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && Capacitor.isNativePlatform()) {
      SplashScreen.hide()
    }
  }, [isLoaded])

  return null
}
