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

{
  /* <script>
  import autoAnimate from '@formkit/auto-animate';
  let tags = ['Rock', 'Punk'];
  function addItem(e) {
    if (e.which === 13) {
      tags.push(e.target.value);
      tags = tags;
      e.target.value = '';
    }
  }
  function remove(target) {
    tags = tags.filter((tag) => target !== tag);
  }
</script>

<label for="add-tag-input" class="tag-input">
  <ul use:autoAnimate> <!-- 👀 thats it folks! -->
    {#each tags as tag (tag)}
      <li class="tag">
        <span>{tag}</span>
        <span on:click={() => remove(tag)}>x</span>
      </li>
    {/each}
    <li>
      <input
        id="add-tag-input"
        type="text"
        placeholder="Add a tag..."
        on:keydown={addItem}
      />
    </li>
  </ul>
</label> */
}
