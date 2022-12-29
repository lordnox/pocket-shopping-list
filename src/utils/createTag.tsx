import { JSX, ParentComponent, splitProps } from 'solid-js'

type ClassList = { [k: string]: boolean | undefined }
type ClassOrClassList = string | ClassList

export interface WithClassOrClassList {
  class?: string
  classList?: ClassList
}

const cleanup = (str: string) => str.replace(/[\n ]+/g, ' ').trim()

export const createTag =
  <Tag extends keyof JSX.IntrinsicElements>(
    tag: Tag,
    render: (props: Omit<JSX.IntrinsicElements[Tag], 'classList' | 'class'> & { classList: ClassList }) => JSX.Element,
    classOrClassList?: string | ClassList | undefined,
  ): ParentComponent<JSX.IntrinsicElements[Tag] & WithClassOrClassList> =>
  (props) => {
    const [, tagProps] = splitProps(props, ['class', 'classList'])
    const classProp = cleanup(props.class ?? '')
    const classList = {
      ...(classProp ? { [classProp]: true } : {}),
      ...props.classList,
      ...(typeof classOrClassList === 'string' ? { [cleanup(classOrClassList)]: true } : classOrClassList ?? {}),
    }
    console.log(classList)
    return render({
      ...tagProps,
      classList,
    })
  }

export const createDiv = (classOrClassList: ClassOrClassList) =>
  createTag('div', (props) => <div {...props} />, classOrClassList)
