import { Component, createSignal, JSX } from 'solid-js'
import { CreateProduct, Product } from '~/types/product-types'
import { CheckCircle } from '../icons/check-circle'
import styles from './styles.module.css'
import { Button } from '../inputs/Button'
import { TagInput } from '../inputs/TagInput'

export const TagsProductForm: Component<{ item: Product; onEnter: (data: CreateProduct) => void }> = (props) => {
  const [tags, setTags] = createSignal<string[]>([])

  const enterItem: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = async (event) => {
    event.preventDefault()
    props.onEnter({
      amount: props.item.prices[0].amount,
      name: props.item.name,
      price: props.item.prices[0].price,
      tags: tags(),
      type: props.item.type,
    })
  }

  return (
    <form class="w-full">
      <div class={styles.row}>
        <TagInput for="tags" tags={tags()} setTags={setTags} />
        <Button onClick={enterItem}>
          <CheckCircle />
        </Button>
      </div>
    </form>
  )
}
