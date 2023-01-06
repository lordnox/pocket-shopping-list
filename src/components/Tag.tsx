import { JSX, ParentComponent, Show, splitProps } from 'solid-js'
import { classes } from '~/utils/classes'
import { StopCircle } from './icons/stop-circle'

export const capitalize = (str: string) => str[0].toLocaleUpperCase() + str.slice(1).toLocaleLowerCase()

export const Tag: ParentComponent<
  JSX.HTMLAttributes<HTMLDivElement> & { children: string; onClick?: (tag: string) => void }
> = (props) => {
  const [, divProps] = splitProps(props, ['onClick'])
  return (
    <div
      {...divProps}
      class={classes(props.class, 'inline-flex select-none flex-nowrap items-center whitespace-nowrap rounded-full  ')}
    >
      {capitalize(props.children)}
      <Show when={props.onClick !== undefined}>
        <StopCircle role="button" class="ml-1 h-4 w-4 stroke-red-400" onClick={() => props.onClick!(props.children)} />
      </Show>
    </div>
  )
}
