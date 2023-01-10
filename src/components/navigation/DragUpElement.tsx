import { createSignal, ParentComponent } from 'solid-js'
import { ChevronUp } from '~/components/icons/chevron-up'
import { useDrag } from '~/utils/use-drag'

export const DragUpElement: ParentComponent = (props) => {
  let containerElement: HTMLDivElement
  let svgElement: SVGSVGElement

  const [open, setOpen] = createSignal(false)
  const [dragging, setDragging] = createSignal(false)

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
      const [displacement, rotate] = calculateDisplacement(state.displacement)
      containerElement.style.transform = `translateY(${displacement}px)`
      svgElement.style.transform = `rotate(${180 - rotate * 180}deg)`
    },
    onFinished(_, state) {
      setDragging(false)
      containerElement.style.transform = ''
      svgElement.style.transform = ''
      state.lockedAt && setOpen((open) => !open)
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

  return (
    <div
      ref={containerElement!}
      class="fixed left-0 bottom-0 z-20 w-full border-t border-primary-500 bg-primary-900"
      classList={{
        transition: !dragging(),
        'opacity-70 translate-y-[calc(100%-1px)]': !dragging() && !open(),
        'opacity-100 translate-y-0': dragging() || open(),
      }}
    >
      <div class="container m-auto w-full">
        <div class="relative -top-14 flex justify-center" ref={dragElement}>
          <button
            class="absolute h-14 w-16 touch-none rounded-t-full border border-b-0 border-primary-500 bg-primary-900 p-2 text-white"
            onClick={() => !dragging() && setOpen((open) => !open)}
          >
            <ChevronUp
              ref={svgElement!}
              class="pointer-events-none"
              classList={{
                transition: !dragging(),
                'rotate-180': open(),
              }}
            />
          </button>
        </div>
        <div class="pb-8">{props.children}</div>
      </div>
    </div>
  )
}
