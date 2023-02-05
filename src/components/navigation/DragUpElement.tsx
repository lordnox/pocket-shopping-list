import { createSignal, onMount, ParentComponent } from 'solid-js'
import { useDrag } from '~/utils/use-drag'

const HANDLE_HEIGHT = '32px'

export const DragUpElement: ParentComponent = (props) => {
  let containerElement: HTMLDivElement

  const [open, setOpen] = createSignal(false)
  const [dragging, setDragging] = createSignal(true)

  const toggleOpen = () =>
    setOpen((open) => {
      setContainerElementStyles(containerElement, open ? 1 : 0)
      return !open
    })

  const setContainerElementStyles = (element: HTMLElement, percent: number) => {
    console.log(percent)
    const height = containerElement.getBoundingClientRect().height
    const displacement = height * percent
    element.style.transform = `translateY(${displacement}px)`
    element.style.opacity = `${1 - percent * 0.4}`
  }

  const resetContainerElementStyles = () => {
    setContainerElementStyles(containerElement, open() ? 0 : 1)
  }

  const calculateDisplacement = (value: number) => {
    const height = containerElement.getBoundingClientRect().height
    const displacement = open()
      ? Math.max(0, Math.min(value, height))
      : Math.min(height, Math.max(value + height - 1, 0))
    return [displacement, displacement / height] as const
  }

  const dragElement = useDrag({
    onStart: () => setDragging(true),
    onChange(_, state) {
      const [, percent] = calculateDisplacement(state.displacement)
      setContainerElementStyles(containerElement, percent)
    },
    onFinished(_, state) {
      setDragging(false)
      if (state.lockedAt) {
        toggleOpen()
      } else resetContainerElementStyles()
    },
    config: {
      axis: 'y',
      factors: {
        lockInFactor: 0.5,
        lockInMin: 10,
        lockInMax: 1000,
        lockOffFactor: 0.5,
        lockOffMin: 10,
        lockOffMax: 1000,
      },
    },
    getElementMaxDistance: () => containerElement.getBoundingClientRect().height,
  })

  onMount(() => {
    resetContainerElementStyles()
    setDragging(false)
  })

  return (
    <div
      ref={containerElement!}
      class="fixed left-0 bottom-0 z-40 w-full border-primary-500 bg-primary-900"
      classList={{
        transition: !dragging(),
      }}
    >
      <div class="container m-auto w-full">
        <div
          class="absolute top-0 flex w-full justify-center"
          ref={dragElement}
          style={{
            transform: `translateY(-${HANDLE_HEIGHT})`,
          }}
        >
          <button
            class="flex w-full touch-none items-center justify-center border-t border-primary-500 bg-primary-900 p-2 text-white"
            style={{
              height: `${HANDLE_HEIGHT}`,
            }}
            type="button"
            onClick={() => !dragging() && toggleOpen()}
          >
            <div class="h-[4px] w-[32px] rounded-full bg-white px-1" />
          </button>
        </div>
        <div class="pb-8">{props.children}</div>
      </div>
    </div>
  )
}
