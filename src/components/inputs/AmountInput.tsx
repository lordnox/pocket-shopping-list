import { ButtonGroupItems } from '../ButtonGroup'
import { InputField } from './InputField'
import { AmountKeys, AmountType, amountTypes, choices } from '~/types/amount'
import { Component, Ref, Setter } from 'solid-js'
import { Accessor } from 'solid-js'
import { ProductType } from '~/types/product-types'

export const AmountInput: Component<{
  ref: (element: HTMLInputElement) => void
  amountType: Accessor<AmountType>
  setAmountType: Setter<AmountType>
}> = (props) => {
  const changeType = (val: typeof choices[AmountKeys], key: AmountKeys) => props.setAmountType(amountTypes[key])

  return (
    <>
      <InputField
        for="amount"
        label={props.amountType().label}
        placeholder={props.amountType().placeholder}
        ref={(element) => {
          props.ref(element)
        }}
        required
        type="number"
        value={props.amountType().defaultValue}
        labelStyle="grid-column-end: span 4;"
        border="LEFT"
      />
      <ButtonGroupItems choices={choices} onChange={changeType} active={props.amountType().key} />
    </>
  )
}
