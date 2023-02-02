import { Link } from '@solidjs/router'
import { children, Component, JSX, ParentComponent, Show, splitProps } from 'solid-js'
import { Dynamic } from 'solid-js/web'
import { Title } from 'solid-start'
import { classes } from '~/utils/classes'

export interface LinkProps extends JSX.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
}
export interface ButtonProps extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>
}
export type LinkOrButton = LinkProps | ButtonProps
export const isLink = (val: LinkOrButton): val is LinkProps => 'href' in val
export const isButton = (val: LinkOrButton): val is ButtonProps => 'onClick' in val

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
export const H1 = createElement('h1', `max-2-xs my-2 text-center text-2xl font-thin uppercase text-secondary-50`)
export const H2 = createElement('h2', `max-2-xs my-4 text-left text-3xl font-thin uppercase text-secondary-50`)
export const P = createElement('p', `text-md text-left font-thin text-secondary-50`)
export const Container = createElement('div', `container mx-auto px-4`)
export const FAB = createElement(
  'button',
  `flex items-center justify-center text-center h-10 w-10 rounded-full border-2 p-0 text-center focus:outline-none focus:ring-4`,
)
export const Code = createElement('pre', 'text-secondary-50')
export const AvatarButton = createElement(
  'button',
  'ml-auto w-10 h-10 overflow-hidden justify-center align-center inline-flex items-center rounded-full border border-secondary-700 text-center text-sm font-medium text-secondary-700 hover:bg-secondary-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-secondary-300 dark:border-secondary-500 dark:text-secondary-500 dark:hover:text-white dark:focus:ring-secondary-800',
)

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

export const Avatar: Component<LinkOrButton> = (props) => {
  return (
    <Show when={isLink(props)} fallback={<AvatarButton {...(props as ButtonProps)}></AvatarButton>}>
      <Link
        {...(props as LinkProps)}
        class={classes(
          'align-center ml-auto inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-secondary-700 text-center text-sm font-medium text-secondary-700 hover:bg-secondary-700 hover:text-white focus:outline-none focus:ring-4 focus:ring-secondary-300 dark:border-secondary-500 dark:text-secondary-500 dark:hover:text-white dark:focus:ring-secondary-800',
          props.class,
        )}
      ></Link>
    </Show>
  )
}
