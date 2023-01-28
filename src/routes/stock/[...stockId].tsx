import { createSignal, Show } from 'solid-js'
import { RouteDataArgs, useRouteData } from 'solid-start'
import StocklistPage from '~/pages/stocklist'
import { StockList } from '~/types/stock-types'
import { trpc } from '~/utils/trpc-client'

export const routeData = (params: RouteDataArgs<{ stockId: string }>) => {
  const [stocklist, setStocklist] = createSignal<StockList>()

  trpc.stockList.query(params.params.stockId).then(setStocklist)

  return { stocklist, params }
}

export default () => {
  const { stocklist } = useRouteData<typeof routeData>()

  return (
    <Show when={stocklist()}>
      <StocklistPage stocklist={stocklist()} />
    </Show>
  )
}
