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
  lockedAt: number
  displacement: number
}

type ProductDragHandler<Element extends HTMLElement> = (element: Element, state: DragState) => void

export interface UseProductDragProps<Element extends HTMLElement> {
  onStart?: ProductDragHandler<Element>
  onChange?: ProductDragHandler<Element>
  onFinished?: ProductDragHandler<Element>
  onLocked?: ProductDragHandler<Element>
  onUnlocked?: ProductDragHandler<Element>
  enabled?: boolean | Accessor<boolean>
}

export const useProductDrag = <Element extends HTMLElement>({
  onStart,
  onChange,
  onFinished,
  onLocked,
  onUnlocked,
  enabled: enabledOption = true,
}: UseProductDragProps<Element>) => {
  let element: Element
  const enabled = typeof enabledOption === 'function' ? enabledOption : () => enabledOption

  const [context, setContext] = createSignal<DragState>({
    lockedAt: 0,
    displacement: 0,
  })

  let widthState = {
    width: 0,
    lockIn: 0,
    lockOff: 0,
  }

  let gesture: DragGesture

  const setCurrentWidth = () => {
    const { width } = element.getBoundingClientRect()
    widthState = {
      width,
      lockIn: Math.min(Math.max(width * LOCK_IN_FACTOR, LOCK_IN_MIN), LOCK_IN_MAX),
      lockOff: Math.min(Math.max(width * LOCK_OFF_FACTOR, LOCK_OFF_MIN), LOCK_OFF_MAX),
    }
  }

  const trigger = (context: DragState, handler?: ProductDragHandler<Element>) => {
    handler?.(element, context)
    return context
  }

  onMount(() => {
    setCurrentWidth()
    element.addEventListener('resize', setCurrentWidth)

    gesture = new DragGesture(
      element,
      ({ movement, first, last }) => {
        // if not enabled, just reset
        if (!enabled()) return
        const displacement = movement[0]
        if (first) return trigger(context(), onStart)

        if (last) return trigger(context(), onFinished)

        const isLocked = Math.abs(displacement) > widthState.lockIn
        const isUnlocked = Math.abs(displacement) < widthState.lockOff

        setContext((context) => {
          // not locked
          if (context.lockedAt === 0) {
            // and currently not in locking position
            if (!isLocked) return { lockedAt: 0, displacement }

            // in locking position
            return trigger(
              {
                lockedAt: displacement,
                displacement,
              },
              onLocked,
            )
          }
          // locked and in unlocking position
          if (isUnlocked)
            return trigger(
              {
                lockedAt: 0,
                displacement,
              },
              onUnlocked,
            )

          // locked and not in unlocking position
          return { lockedAt: context.lockedAt, displacement }
        })
        trigger(context(), onChange)
      },
      {
        axis: 'x',
      },
    )
  })

  onCleanup(() => {
    gesture?.destroy()
    element?.removeEventListener('resize', setCurrentWidth)
  })

  return (el?: Element) => (el ? (element = el) : element)
}
