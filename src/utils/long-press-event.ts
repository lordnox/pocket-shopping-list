import { Accessor } from 'solid-js'
import { onCleanup } from 'solid-js'
import { isServer } from 'solid-js/web'

const DEFAULT_LONGPRESS_TIMEOUT = 1250

/**
 * Cancels the current event
 */
const cancelEvent = (e: Event) => {
  e.stopImmediatePropagation()
  e.preventDefault()
  e.stopPropagation()
}

const requestTimeout = (fn: VoidFunction, delay: number) => {
  if (!requestAnimationFrame) setTimeout(fn, delay)

  const start = new Date().getTime()
  const handle: {
    active: boolean
    value: number
  } = {
    active: true,
    value: 0,
  }

  const loop = function () {
    if (!handle.active) return // cancel
    const current = new Date().getTime()
    const delta = current - start

    if (delta >= delay) {
      fn()
    } else {
      handle.value = requestAnimationFrame(loop)
    }
  }

  handle.value = requestAnimationFrame(loop)

  return () => (handle.active = false)
}

interface LongPressContext {
  clientX: number
  clientY: number
}

export const longPress = (
  element: HTMLElement,
  onFinished: (event: TouchEvent) => void,
  options: {
    enabled?: boolean | Accessor<boolean>
    timeout?: number
    delta?: number
    onStart?: VoidFunction
    onCancel?: VoidFunction
  } = {},
) => {
  if (isServer) return

  const { delta = 5, timeout = DEFAULT_LONGPRESS_TIMEOUT, onCancel = () => {}, onStart = () => {} } = options
  let { enabled = true } = options
  const deltaSquare = delta * delta
  const isEnabled = typeof enabled === 'boolean' ? () => enabled : enabled

  let clear: VoidFunction = () => {}

  const finish = (event: TouchEvent) => () => {
    cancelEvent(event)
    clear()
    onFinished(event)
  }

  const cancel = () => {
    clear()
    onCancel()
  }

  const createMoveEvent =
    ({ clientX, clientY }: LongPressContext) =>
    (moveEvent: TouchEvent) => {
      const dX = Math.abs(moveEvent.touches[0].clientX - clientX)
      const dY = Math.abs(moveEvent.touches[0].clientY - clientY)
      if (dX + dY > deltaSquare) cancel()
    }

  const start = (event: TouchEvent) => {
    if (!isEnabled()) return
    clear()

    const context: LongPressContext = {
      clientX: event.touches[0].clientX,
      clientY: event.touches[0].clientY,
    }
    const moveEvent = createMoveEvent(context)

    element.addEventListener('touchend', cancel)
    element.addEventListener('touchcancel', cancel)
    element.addEventListener('contextmenu', cancelEvent)
    element.addEventListener('touchmove', moveEvent)
    const currentUserSelect = element.style.userSelect
    element.style.userSelect = 'none'

    const disableTimeout = requestTimeout(finish(event), timeout)

    clear = () => {
      disableTimeout()
      element.style.userSelect = currentUserSelect
      element.removeEventListener('touchend', cancel)
      element.removeEventListener('touchcancel', cancel)
      element.removeEventListener('contextmenu', cancelEvent)
      element.removeEventListener('touchmove', moveEvent)
    }

    onStart()
  }
  element.addEventListener('touchstart', start)

  onCleanup(() => {
    clear()
    element.removeEventListener('touchstart', start)
  })
}
