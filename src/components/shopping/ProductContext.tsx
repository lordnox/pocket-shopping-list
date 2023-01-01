import { Accessor, createContext, useContext } from 'solid-js'

export const ProductContext = createContext<{
  actionPending: Accessor<string | undefined>
  cancelAction: () => void
  isActionPending: (action: string) => boolean
  setAction: (action: string) => void
}>()

export const useProductContext = () => useContext(ProductContext)
