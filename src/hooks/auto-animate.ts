import autoAnimate, { type AutoAnimateOptions, type AutoAnimationPlugin } from '@formkit/auto-animate'
import { onMount } from 'solid-js'

export const useAutoAnimate = (opts?: Partial<AutoAnimateOptions> | AutoAnimationPlugin | undefined) => {
  let element: HTMLElement
  onMount(() => {
    autoAnimate(element, opts)
  })
  return (el: HTMLElement) => (element = el)
}
