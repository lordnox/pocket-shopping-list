import { children, JSX, ParentComponent, splitProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { Title } from 'solid-start'
import { classes } from '~/utils/classes'

export const createElement =
  <Key extends keyof JSX.IntrinsicElements>(
    tag: Key,
    classStyling: string,
  ): ParentComponent<JSX.IntrinsicElements[Key]> =>
  (props) =>
    (
      <Dynamic
        component={tag as keyof JSX.IntrinsicElements}
        {...props}
        class={classes('class' in props ? props.class : undefined, classStyling)}
      >
        {children(() => props.children)}
      </Dynamic>
    )

export const Main = createElement('main', `mx-auto p-4 text-left text-primary-70`)
export const H1 = createElement('h1', `max-6-xs my-8 text-center text-6xl font-thin uppercase text-secondary-50`)
export const H2 = createElement('h2', `max-2-xs my-4 text-left text-3xl font-thin uppercase text-secondary-50`)
export const P = createElement('p', `text-md text-left font-thin text-secondary-50`)
export const Container = createElement('div', `container mx-auto px-4`)

const SectionWrapper = createElement(
  'section',
  `w-full py-4 text-secondary-600 odd:bg-primary-200 even:bg-primary-100 hover:bg-primary-50 odd:dark:bg-primary-800 even:dark:bg-primary-700 hover:dark:bg-primary-600`,
)

export const H1WithTitle: ParentComponent<JSX.HTMLAttributes<HTMLHeadingElement>> = (props) => {
  return (
    <>
      <Title>{props.children}</Title>
      <H1 {...props} />
    </>
  )
}

export const Section: ParentComponent<JSX.HTMLAttributes<HTMLElement>> = (props) => {
  const [, sectionProps] = splitProps(props, ['children'])
  return (
    <SectionWrapper {...sectionProps}>
      <Container children={props.children} />
    </SectionWrapper>
  )
}
