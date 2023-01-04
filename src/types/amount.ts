import { ItemType } from '@prisma/client'
import { ProductType } from '~/types/product-types'

export interface AmountType {
  key: ItemType
  label: string
  placeholder: string
  unit: [string, string]
  defaultValue: number
}

export const choices: Record<ItemType, string> = {
  kilogram: 'kg',
  liter: 'l',
  piece: 'st.',
}

export type AmountKeys = keyof typeof choices

export const amountTypes: Record<ItemType, AmountType> = {
  kilogram: {
    key: 'kilogram',
    label: 'Menge (g)',
    placeholder: 'Menge in g',
    unit: ['g', 'kg'],
    defaultValue: 1000,
  },
  liter: {
    key: 'liter',
    label: 'Volumen (ml)',
    placeholder: 'Volumen in ml',
    unit: ['ml', 'l'],
    defaultValue: 1000,
  },
  piece: {
    key: 'piece',
    label: 'Stück',
    placeholder: 'Stückzahl',
    unit: ['St.', 'St.'],
    defaultValue: 1,
  },
}

const selectUnit = (amount: number) => (amount >= 1000 ? 1 : 0)
const numberFormat = (val: string) => val.replace(/\./g, ',')

export const priceString = (price: number, type: ProductType) => `${numberFormat((price / 100).toFixed(2))} €`

export const amountString = (amount: number, type: ProductType) => {
  if (type === 'piece') return `${amount} ${amountTypes[type].unit[0]}`

  const unit = selectUnit(amount)
  const amountType = amountTypes[type]
  const number = unit ? (amount / amountType.defaultValue).toFixed(1) : amount.toString()
  return `${numberFormat(number)} ${amountType.unit[unit]}`
}
