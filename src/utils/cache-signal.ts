import { Accessor, createEffect, createSignal, onMount } from 'solid-js'
import { isServer } from 'solid-js/web'

const readStorage = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '')
  } catch (e) {
    return undefined
  }
}

const writeStorage = (key: string, value: any) => {
  try {
    return localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    return undefined
  }
}

export const cacheDefined = <Type>(key: string, getter: Accessor<Type>): Accessor<Type> => {
  if (isServer) return getter
  const [cache, setCache] = createSignal<Type>(getter())
  onMount(() => setCache(readStorage(key)))

  createEffect(() => {
    const data = getter()
    // ignore caching undefined values
    if (typeof data === 'undefined') return
    setCache(() => data)
    writeStorage(key, data)
  })

  return cache
}
