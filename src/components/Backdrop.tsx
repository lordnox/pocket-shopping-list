import { ParentComponent } from 'solid-js'
import { Portal } from 'solid-js/web'

export const Backdrop: ParentComponent<{
  onClick?: VoidFunction
  open: boolean
  height?: 'high' | 'middle' | 'low'
}> = (props) => (
  <Portal>
    <div
      class="fixed top-0 left-0 right-0 bottom-0 backdrop-blur-sm transition"
      classList={{
        'pointer-events-none opacity-0': props.open,
        'z-50': props.height === 'high' || props.height === undefined,
        'z-30': props.height === 'middle',
        'z-10': props.height === 'low',
      }}
      onClick={props.onClick}
    >
      {props.children}
    </div>
  </Portal>
)
