import { createEffect, createSignal, Show } from 'solid-js'
import { Code, Container, H1WithTitle, Main } from '~/components/Basics'
import { useAutoAnimate } from '~/hooks/auto-animate'
import { StockList } from '~/types/stock-types'
import { trpc } from '~/utils/trpc-client'
import { SubNavigation } from '~/components/SubNavigation'
import { useHomeLink } from '~/roots/navigation'
import { Title } from '~/components/Layout'

export default (pageParams: { stocklist?: StockList }) => {
  console.log('Rendering Stocklist from scratch!')

  const [stocklist, setStocklist] = createSignal<StockList | undefined>(pageParams.stocklist)

  const goto = (stocklist: StockList) => {
    console.log('goto ' + stocklist.name)
    history.pushState({}, '', `/stock/${stocklist.id}`)
    setStocklist(stocklist)
  }

  useHomeLink('🛒', { href: '/' })

  return (
    <Main>
      <Title>{stocklist() ? stocklist()?.name! : 'Vorrat'}</Title>
      <SubNavigation currentStocklist={stocklist()} setStocklist={goto} createStocklist={trpc.createStockList.mutate} />
      <Container ref={useAutoAnimate()}>
        <Show when={stocklist()}>
          <div ref={useAutoAnimate()}>
            <Code>{JSON.stringify(stocklist(), null, 2)}</Code>
          </div>
        </Show>
      </Container>
    </Main>
  )
}
