import { createSignal, Show } from 'solid-js'
import { Code, Container, H1WithTitle, Main } from '~/components/Basics'
import { useAutoAnimate } from '~/hooks/auto-animate'
import { StockList } from '~/types/stock-types'
import { trpc } from '~/utils/trpc-client'
import { StocklistChooser } from '~/components/stock/StocklistChooser'
import { useHomeLink } from '~/roots/navigation'

export default (pageParams: { stocklist?: StockList }) => {
  console.log('Rendering Stocklist from scratch!')

  const [stocklist, setStocklist] = createSignal<StockList | undefined>(pageParams.stocklist)

  const goto = (stocklist: StockList) => {
    console.log('goto ' + stocklist.name)
    history.pushState({}, '', `/stock/${stocklist.id}`)
    setStocklist(stocklist)
  }

  useHomeLink((event) => {
    event.preventDefault()
    setStocklist()
  })

  return (
    <Main>
      <Container ref={useAutoAnimate()}>
        <Show when={!stocklist()}>
          <H1WithTitle>Vorrat</H1WithTitle>
        </Show>
        <StocklistChooser
          currentStocklist={stocklist()}
          setStocklist={goto}
          createStocklist={trpc.createStockList.mutate}
        />
        <Show when={stocklist()}>
          <div ref={useAutoAnimate()}>
            <H1WithTitle>{stocklist()?.name}</H1WithTitle>
            <Code>{JSON.stringify(stocklist(), null, 2)}</Code>
          </div>
        </Show>
      </Container>
    </Main>
  )
}
