import { ButtonGroupItems } from '../ButtonGroup'
import { InputField } from './InputField'
import { AmountKeys, AmountType, amountTypes, choices } from '~/types/amount'
import { Component, onMount, Ref, Setter } from 'solid-js'

export const AmountInput: Component<{
  ref: (element: HTMLInputElement) => void
  amountType: AmountType
  setAmountType: Setter<AmountType>
}> = (props) => {
  let inputElement: HTMLInputElement

  const changeType = (val: typeof choices[AmountKeys], key: AmountKeys) => {
    const oldAmountType = props.amountType
    props.setAmountType(amountTypes[key])
    if ('' + oldAmountType.defaultValue === inputElement.value) inputElement.value = '' + amountTypes[key].defaultValue
  }

  onMount(() => {
    inputElement.value = '' + props.amountType.defaultValue
  })

  return (
    <>
      <InputField
        for="amount"
        label={props.amountType.label}
        placeholder={props.amountType.placeholder}
        ref={(element) => {
          inputElement = element
          props.ref(element)
        }}
        required
        type="number"
        labelStyle="grid-column-end: span 4;"
        border="LEFT"
      />
      <ButtonGroupItems choices={choices} onChange={changeType} active={props.amountType.key} />
    </>
  )
}
