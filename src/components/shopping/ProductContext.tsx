import { Accessor, createContext, useContext } from 'solid-js'

export const ProductContext = createContext<{
  actionPending: Accessor<string | undefined>
}>()

export const useProductContext = () => useContext(ProductContext)
