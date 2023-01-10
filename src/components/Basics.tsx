import { children, JSX, ParentComponent } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { Title } from 'solid-start'
import { classes } from '~/utils/classes'

const Element =
  <Key extends keyof JSX.IntrinsicElements>(
    tag: Key,
    classStyling: string,
  ): ParentComponent<JSX.IntrinsicElements[Key]> =>
  (props) => {
    const c = children(() => props.children)
    return (
      <Dynamic
        component={tag as keyof JSX.IntrinsicElements}
        {...props}
        class={classes('class' in props ? props.class : undefined, classStyling)}
      >
        {c}
      </Dynamic>
    )
  }

export const Main = Element('main', 'mx-auto p-4 text-left text-primary-700')
export const H1Only = Element('h1', 'max-6-xs my-8 text-center text-6xl font-thin uppercase text-secondary-500')
export const H2 = Element('h2', 'max-2-xs my-4 text-left text-3xl font-thin uppercase text-secondary-500')
export const P = Element('p', 'text-md text-left font-thin text-secondary-500')
export const SectionOnly = Element(
  'section',
  `w-full py-4 text-secondary-600 odd:bg-primary-200 even:bg-primary-100 hover:bg-primary-50 odd:dark:bg-primary-800 even:dark:bg-primary-700 hover:dark:bg-primary-600`,
)

export const H1: ParentComponent<JSX.HTMLAttributes<HTMLHeadingElement>> = (props) => {
  return (
    <>
      <Title>{props.children}</Title>
      <H1Only
        {...props}
        class={classes(props.class, 'max-6-xs my-8 text-center text-6xl font-thin uppercase text-secondary-500')}
      />
    </>
  )
}

export const Section: ParentComponent<JSX.HTMLAttributes<HTMLElement>> = (props) => {
  const c = children(() => props.children)
  return (
    <SectionOnly
      {...props}
      class={classes(
        props.class,
        `w-full py-4 text-secondary-600 odd:bg-primary-200 even:bg-primary-100 hover:bg-primary-50 odd:dark:bg-primary-800 even:dark:bg-primary-700 hover:dark:bg-primary-600`,
      )}
    >
      <div class="container mx-auto px-4">{c}</div>
    </SectionOnly>
  )
}
