import { Component, For } from 'solid-js'
import { createDiv } from '../../utils/createTag'

const Tag = createDiv(`
  bg-gray-100
  text-gray-800
  text-xs
  font-semibold
  mr-2
  px-2.5
  py-0.5
  rounded
  dark:bg-gray-700
  dark:text-gray-300
`)

export const ShoppingTags: Component<{ tags: string[] }> = (props) => {
  return (
    <div class="flex">
      <For each={props.tags}>{(tag) => <Tag>{tag}</Tag>}</For>
    </div>
  )
}
