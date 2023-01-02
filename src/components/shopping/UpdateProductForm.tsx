import { Component, JSX, onMount } from 'solid-js'
import { CreateProduct, Product } from '~/types/product-types'
import { CheckCircle } from '../icons/check-circle'
import { Input } from '../inputs/InputField'
import { AmountKeys, amountTypes } from './amount'
import styles from './styles.module.css'
import { Button } from '../inputs/Button'

export const UpdateProductForm: Component<{ item: Product; onEnter: (data: CreateProduct) => void }> = (props) => {
  let priceInputElement: HTMLInputElement
  let amountTypeInputElement: HTMLInputElement

  const defaultAmountType: AmountKeys = 'kilogram'

  const enterItem: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = async (event) => {
    event.preventDefault()
    if (!priceInputElement) throw new Error('Could not correctly identify form elements')
    const price = parseInt(priceInputElement.value)
    const amount = parseInt(amountTypeInputElement.value)
    props.onEnter({ ...props.item, price, amount, tags: props.item.tags.map((tag) => tag.name) })
  }

  onMount(() => {
    priceInputElement.value = '' + props.item.prices[0].price
    amountTypeInputElement.value = '' + props.item.prices[0].amount
  })

  return (
    <form>
      <div class={styles.row}>
        <Input class={styles.item} placeholder="Preis" ref={priceInputElement!} required type="number" />
        <Input
          class={styles.itemHalf}
          placeholder={amountTypes[defaultAmountType].placeholder}
          ref={amountTypeInputElement!}
          required
          type="number"
          value="1000"
        />
        <Button onClick={enterItem}>
          <CheckCircle />
        </Button>
      </div>
    </form>
  )
}
