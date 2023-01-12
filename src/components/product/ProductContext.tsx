import { Accessor, createContext, Setter, useContext } from 'solid-js'
import { Product } from '~/types/product-types'

export type ProductState = 'mini' | 'midi' | 'maxi'

export interface FilterScore {
  filterScore: Accessor<number>
  setFilterScore: Setter<number>
}
export type WrappedProduct = Product & FilterScore

export interface ProductContext {
  setState: Setter<ProductState>
  state: Accessor<ProductState>
  activeAnimation: Accessor<boolean>
  product: WrappedProduct
}

export const ProductContext = createContext<ProductContext>()

export const useProductContext = () => {
  const context = useContext(ProductContext)
  if (!context) throw new ReferenceError('ProductContext')
  return context
}

export const ProductListContext = createContext<{
  actionPending: Accessor<string | undefined>
  cancelAction: () => void
  isActionPending: (action: string) => boolean
  setAction: Setter<string>
}>()

export const useProductListContext = () => {
  const context = useContext(ProductListContext)
  if (!context) throw new ReferenceError('ProductListContext')
  return context
}
