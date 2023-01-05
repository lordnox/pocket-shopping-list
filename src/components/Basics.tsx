import { JSX, ParentComponent } from 'solid-js'
import { Title } from 'solid-start'
import { classes } from '~/utils/classes'

export const Main: ParentComponent<JSX.HTMLAttributes<HTMLElement>> = (props) => (
  <main {...props} class={classes(props.class, 'mx-auto p-4 text-left text-gray-700')} />
)

export const H1: ParentComponent<JSX.HTMLAttributes<HTMLHeadingElement>> = (props) => (
  <>
    <Title>{props.children}</Title>
    <h1
      {...props}
      class={classes(props.class, 'max-6-xs my-8 text-center text-6xl font-thin uppercase text-sky-700')}
    />
  </>
)

export const H2: ParentComponent<JSX.HTMLAttributes<HTMLHeadingElement>> = (props) => (
  <h2 {...props} class={classes(props.class, 'max-2-xs my-4 text-left text-3xl font-thin uppercase text-sky-700')} />
)

export const P: ParentComponent<JSX.HTMLAttributes<HTMLParagraphElement>> = (props) => (
  <p {...props} class={classes(props.class, 'text-md text-left font-thin text-sky-600')} />
)
