import { createSignal, Show } from 'solid-js'
import { RouteDataArgs, useRouteData } from 'solid-start'
import { ShoppingListPage } from '~/pages/shoppinglist'
import { StockList } from '~/types/stock-types'
import { trpc } from '~/utils/trpc-client'

export const routeData = (params: RouteDataArgs<{ shoppingListId: string }>) => {
  const [stocklist, setStocklist] = createSignal<StockList>()

  trpc.stockList.query(params.params.shoppingListId).then(setStocklist)

  return { stocklist, params }
}

export default () => {
  const { stocklist } = useRouteData<typeof routeData>()

  return (
    <Show when={stocklist()}>
      <ShoppingListPage stocklist={stocklist()} />
    </Show>
  )
}
