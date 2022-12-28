import { ItemType } from '@prisma/client'

export interface AmountType {
  key: ItemType
  label: string
  placeholder: string
  unit: [string, string]
}

export const choices: Record<ItemType, string> = {
  liter: 'l',
  kilogram: 'kg',
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
}
