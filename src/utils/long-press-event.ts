import { onCleanup } from 'solid-js'
import { isServer } from 'solid-js/web'

const DEFAULT_LONGPRESS_TIMEOUT = 1250

/**
 * Cancels the current event
 */
export const cancelEvent = (e: Event) => {
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

export const longPress = (element: HTMLElement, listener: (event: TouchEvent) => void) => {
  if (isServer) return

  const deltaSquare = 5 * 5

  let disableTimeout: VoidFunction = () => {}
  let clear: VoidFunction = () => {}
  let enabled: boolean = true

  const finish = (event: TouchEvent) => () => {
    console.log('finished')
    event.preventDefault()
    clear()
    listener(event)
  }

  const createMoveEvent =
    ({ clientX, clientY }: LongPressContext) =>
    (moveEvent: TouchEvent) => {
      const dX = Math.abs(moveEvent.touches[0].clientX - clientX)
      const dY = Math.abs(moveEvent.touches[0].clientY - clientY)
      console.log(dX + dY, deltaSquare)
      if (dX + dY > deltaSquare) clear()
    }

  const start = (event: TouchEvent) => {
    if (!enabled) return

    const context: LongPressContext = {
      clientX: event.touches[0].clientX,
      clientY: event.touches[0].clientY,
    }
    const moveEvent = createMoveEvent(context)
    clear()

    element.addEventListener('touchend', clear)
    element.addEventListener('touchcancel', clear)
    element.addEventListener('contextmenu', cancelEvent)
    element.addEventListener('touchmove', moveEvent)
    const currentUserSelect = element.style.userSelect
    element.style.userSelect = 'none'

    disableTimeout = requestTimeout(finish(event), DEFAULT_LONGPRESS_TIMEOUT)

    clear = () => {
      disableTimeout()
      element.style.userSelect = currentUserSelect
      element.removeEventListener('touchend', finish)
      element.removeEventListener('touchcancel', clear)
      element.removeEventListener('contextmenu', cancelEvent)
      element.removeEventListener('touchmove', moveEvent)
    }
  }
  element.addEventListener('touchstart', start)

  onCleanup(() => {
    clear()
    element.removeEventListener('touchstart', start)
  })
  return {
    enable: () => (enabled = true),
    disable: () => (enabled = false),
    get enabled() {
      return enabled
    },
  }
}
