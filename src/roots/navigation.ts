import { createRoot, createSignal, JSX, onCleanup, onMount } from 'solid-js'
import { LinkOrButton } from '~/components/Basics'

export const navigation = createRoot(() => {
  const [homeAction, setHomeAction] = createSignal<{
    content: JSX.Element
    props: LinkOrButton
  }>()
  const [title, setTitle] = createSignal<string>('Application')
  return {
    homeAction,
    setHomeAction,
    title,
    setTitle,
  }
})

export const useHomeLink = (content: JSX.Element, props: LinkOrButton) => {
  onMount(() => {
    navigation.setHomeAction({
      content,
      props,
    })
  })

  onCleanup(() => {
    navigation.setHomeAction(undefined)
  })
}
