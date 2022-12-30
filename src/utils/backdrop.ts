import { createRoot, createSignal } from 'solid-js'

const [backdropTriggers, setBackdropTriggers] = createRoot(() => createSignal<VoidFunction[]>([]))

export const backdropActive = () => !!backdropTriggers().length

export const backdrop = (fn: VoidFunction) => setBackdropTriggers((triggers) => [...triggers, fn])
