import { ItemType } from '@prisma/client'
import { ProductType } from '~/types/product-types'

export interface AmountType {
  key: ItemType
  label: string
  placeholder: string
  unit: [string, string]
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
  },
  liter: {
    key: 'liter',
    label: 'Volumen (ml)',
    placeholder: 'Volumen in ml',
    unit: ['ml', 'l'],
  },
  piece: {
    key: 'piece',
    label: 'Stück',
    placeholder: 'Stückzahl',
    unit: ['St.', 'St.'],
  },
}

const selectUnit = (amount: number) => (amount >= 1000 ? 1 : 0)

const selectDivider = (type: ProductType) => (type === 'piece' ? 1000_00 : 1_00)

export const priceString = (price: number, type: ProductType) => {
  return `${(price / selectDivider(type)).toFixed(2).replace(/\./g, ',')} €`
}

export const amountString = (amount: number, type: ProductType) => {
  if (type === 'piece') return `${amount} ${amountTypes[type].unit[0]}`
  const unit = selectUnit(amount)
  const number = unit ? (amount / 1000).toFixed(1) : amount.toString()
  return `${number} ${amountTypes[type].unit[unit]}`
}
