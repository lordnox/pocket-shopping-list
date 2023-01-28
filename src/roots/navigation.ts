import { createRoot, createSignal, JSX, onCleanup, onMount } from 'solid-js'

export const navigation = createRoot(() => {
  const [homeAction, setHomeAction] = createSignal<JSX.EventHandlerUnion<HTMLAnchorElement, MouseEvent>>()
  return {
    homeAction,
    setHomeAction,
  }
})

export const useHomeLink = (handler: JSX.EventHandlerUnion<HTMLAnchorElement, MouseEvent>) => {
  onMount(() => {
    navigation.setHomeAction((currentValue) => {
      if (currentValue) throw new Error('Somehow the current home link is not correctly reset!')
      return handler
    })
  })

  onCleanup(() => {
    navigation.setHomeAction()
  })
}
