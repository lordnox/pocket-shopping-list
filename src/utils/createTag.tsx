import { JSX, ParentComponent, splitProps } from 'solid-js'

type ClassList = { [k: string]: boolean | undefined }
type ClassOrClassList = string | ClassList

export interface WithClassOrClassList {
  class?: string
  classList?: ClassList
}

export const createTag =
  <Tag extends keyof JSX.IntrinsicElements>(
    tag: Tag,
    render: (props: Omit<JSX.IntrinsicElements[Tag], 'classList' | 'class'> & { classList: ClassList }) => JSX.Element,
    classOrClassList?: string | ClassList | undefined,
  ): ParentComponent<JSX.IntrinsicElements[Tag] & WithClassOrClassList> =>
  (props) => {
    const [, tagProps] = splitProps(props, ['class', 'classList'])
    return render({
      ...tagProps,
      classList: {
        [props.class ?? '']: true,
        ...props.classList,
        ...(typeof classOrClassList === 'string' ? { [classOrClassList]: true } : classOrClassList ?? {}),
      },
    })
  }

export const createDiv = (classOrClassList: ClassOrClassList) =>
  createTag('div', (props) => <div {...props} />, classOrClassList)
