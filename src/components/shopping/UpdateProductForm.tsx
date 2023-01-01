import { Component, JSX } from 'solid-js'
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
    priceInputElement.value = ''
    amountTypeInputElement.value = '1000'
    props.onEnter({ ...props.item, price, amount, tags: props.item.tags.map((tag) => tag.name) })
  }

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
