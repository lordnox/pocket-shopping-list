import { Accessor, createContext, Setter, useContext } from 'solid-js'

export type ProductState = 'mini' | 'midi' | 'maxi'

export const ProductContext = createContext<{
  setState: Setter<ProductState>
  state: Accessor<ProductState>
}>()

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
