import { createRoot, createSignal, onMount } from 'solid-js'

export const geolocation = createRoot(() => {
  const [hasPermission, setHasPermission] = createSignal<'unknown' | PermissionState>('unknown')

  const getPermission = async () => {
    const permission = await navigator.permissions.query({ name: 'geolocation' })
    setHasPermission(permission.state)
    return permission.state
  }

  const getCurrentPosition = () =>
    new Promise<GeolocationPosition | null>(async (resolve) => {
      navigator.geolocation.getCurrentPosition(resolve, () => resolve(null), {
        enableHighAccuracy: true,
        maximumAge: 60 * 1000,
      })
    })

  const getGeoLocation = async (onlyIfGranted = true) => {
    const permission = await getPermission()
    if (permission === 'denied') return null
    if (permission === 'prompt' && onlyIfGranted) return null
    return getCurrentPosition()
  }

  onMount(getPermission)

  return {
    position: getCurrentPosition,
    location: getGeoLocation,
    permission: getPermission,
    hasPermission,
  }
})
