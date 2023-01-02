import { DragGesture } from '@use-gesture/vanilla'
import { createSignal, onMount, onCleanup, Accessor } from 'solid-js'
import { vibrate } from '~/utils/vibrate'

const LOCK_IN_FACTOR = 0.2
const LOCK_IN_MIN = 60
const LOCK_IN_MAX = 150
const LOCK_OFF_FACTOR = 0.15
const LOCK_OFF_MIN = 40
const LOCK_OFF_MAX = 120

interface DragState {
  locked: boolean
  movement: number
}

export interface UseProductDragProps<Element extends HTMLElement> {
  onFinished: (element: Element, state: DragState) => void
}

export const useProductDrag = <Element extends HTMLElement>({ onFinished }: UseProductDragProps<Element>) => {
  let element: Element

  const [movement, setMovement] = createSignal(0)
  const [locked, setLocked] = createSignal(false)

  let gesture: DragGesture

  onMount(() => {
    gesture = new DragGesture(
      element,
      ({ movement, first, last }) => {
        if (first) {
          element.style.transition = 'none'
          return
        }
        if (last) {
          onFinished(element, {
            locked: locked(),
            movement: movement[0],
          })
          // handle events here
          return
        }
        const currentWidth = element.getBoundingClientRect().width
        const isLocked =
          Math.abs(movement[0]) > Math.max(Math.min(currentWidth * LOCK_IN_FACTOR, LOCK_IN_MIN), LOCK_IN_MAX)
        const isUnlocked =
          Math.abs(movement[0]) < Math.max(Math.min(currentWidth * LOCK_OFF_FACTOR, LOCK_OFF_MIN), LOCK_OFF_MAX)
        setLocked((currentlyLocked) => {
          if (currentlyLocked) return isUnlocked ? false : currentlyLocked
          // if we are locking, vibrate shortly
          if (isLocked) vibrate(200)
          return isLocked
        })
        element.style.transform = `translate(${movement[0]}px)`
        setMovement(movement[0])
      },
      {
        axis: 'x',
      },
    )
  })

  onCleanup(() => gesture?.destroy())

  return [(el?: Element) => (el ? (element = el) : element), movement, locked] as const
}
