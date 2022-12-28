import { Component, For } from 'solid-js'
import { createDiv } from '../../utils/createTag'

const Tag = createDiv('test')

export const ShoppingTags: Component<{ tags: string[] }> = (props) => {
  return (
    <div>
      <For each={props.tags}>{(tag) => <Tag>{tag}</Tag>}</For>
    </div>
  )
}
