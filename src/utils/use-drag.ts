import { DragGesture, UserDragConfig } from '@use-gesture/vanilla'
import { createSignal, onMount, onCleanup, Accessor } from 'solid-js'

const LOCK_IN_FACTOR = 0.2
const LOCK_IN_MIN = 60
const LOCK_IN_MAX = 150
const LOCK_OFF_FACTOR = 0.15
const LOCK_OFF_MIN = 40
const LOCK_OFF_MAX = 120

interface Factors {
  lockInFactor: number
  lockInMin: number
  lockInMax: number
  lockOffFactor: number
  lockOffMin: number
  lockOffMax: number
}

const defaultFactors: Factors = {
  lockInFactor: LOCK_IN_FACTOR,
  lockInMin: LOCK_IN_MIN,
  lockInMax: LOCK_IN_MAX,
  lockOffFactor: LOCK_OFF_FACTOR,
  lockOffMin: LOCK_OFF_MIN,
  lockOffMax: LOCK_OFF_MAX,
}

interface DragState {
  lockedAt: number
  displacement: number
}

type DragHandler<Element extends HTMLElement> = (element: Element, state: DragState) => void

export interface UseDragProps<Element extends HTMLElement> {
  onStart?: DragHandler<Element>
  onCancel?: DragHandler<Element>
  onChange?: DragHandler<Element>
  onFinished?: DragHandler<Element>
  onLocked?: DragHandler<Element>
  onUnlocked?: DragHandler<Element>
  enabled?: boolean | Accessor<boolean>
  config: UserDragConfig & { axis: UserDragConfig['axis']; factors?: Partial<Factors> }
  getElementMaxDistance?: (element: Element) => number
}

const getElementMaxWidth = (element: HTMLElement) => element.getBoundingClientRect().width
const getElementMaxHeight = (element: HTMLElement) => element.getBoundingClientRect().height

export const useDrag = <Element extends HTMLElement>({
  onStart,
  onCancel,
  onChange,
  onFinished,
  onLocked,
  onUnlocked,
  enabled: enabledOption = true,
  config,
  getElementMaxDistance = config.axis === 'x' ? getElementMaxWidth : getElementMaxHeight,
}: UseDragProps<Element>) => {
  let element: Element
  const factors = {
    ...defaultFactors,
    ...config.factors,
  }
  const enabled = typeof enabledOption === 'function' ? enabledOption : () => enabledOption

  const [context, setContext] = createSignal<DragState>({
    lockedAt: 0,
    displacement: 0,
  })

  let state = {
    distance: 0,
    lockIn: 0,
    lockOff: 0,
  }

  let gesture: DragGesture

  const setCurrentState = () => {
    const distance = getElementMaxDistance(element)
    state = {
      distance,
      lockIn: Math.min(Math.max(distance * factors.lockInFactor, factors.lockInMin), factors.lockInMax),
      lockOff: Math.min(Math.max(distance * factors.lockOffFactor, factors.lockOffMin), factors.lockOffMax),
    }
  }

  const trigger = (context: DragState, handler?: DragHandler<Element>) => {
    handler?.(element, context)
    return context
  }

  onMount(() => {
    setCurrentState()
    element.addEventListener('resize', setCurrentState)

    gesture = new DragGesture(
      element,
      ({ movement, first, last, canceled, cancel }) => {
        // if not enabled, just reset
        if (canceled || !enabled()) {
          if (!canceled) cancel()
          return trigger(context(), onCancel)
        }
        const displacement = movement[config.axis === 'x' ? 0 : 1]

        if (first) return trigger(context(), onStart)

        if (last) return trigger(context(), onFinished)

        const isLocked = Math.abs(displacement) > state.lockIn
        const isUnlocked = Math.abs(displacement) < state.lockOff

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
      config,
    )
  })

  onCleanup(() => {
    gesture?.destroy()
    element?.removeEventListener('resize', setCurrentState)
  })

  return (el?: Element) => (el ? (element = el) : element)
}
