import { Component, createMemo, Show, For, createSignal, createEffect } from 'solid-js'
import { useAutoAnimate } from '~/hooks/auto-animate'
import { StockList, updateStockList } from '~/types/stock-types'
import { FAB } from './Basics'
import { StockIcons, Add, Settings } from './icons/icons'
import { stockRoot } from '../roots/stock'
import { CreateStockForm, CreateStockFormProps } from './stock/CreateStockForm'

const StockListEntry: Component<{ stocklist: StockList; onClick: VoidFunction }> = (props) => {
  const icon = createMemo(() => {
    const { icon } = props.stocklist

    if (icon) {
      const iconNumber = parseInt(icon, 10)
      if (!isNaN(iconNumber) && StockIcons[iconNumber]) {
        const Icon = StockIcons[iconNumber]
        return <Icon />
      }
    }
    return props.stocklist.name.slice(0, 2).toLocaleUpperCase()
  })
  return (
    <FAB onClick={props.onClick} class={`flex-shrink-0 border-secondary-600 text-secondary-600 transition`}>
      {icon()}
    </FAB>
  )
}

export const SubNavigation: Component<{
  setStocklist: (stocklist: StockList) => void
  createStocklist: (stocklist: { name: string; icon: string }) => Promise<StockList>
  currentStocklist?: StockList
}> = (props) => {
  const [mode, setMode] = createSignal<'none' | 'createStockList' | 'editStockList'>('none')
  const [stocklists, refetch, setStocklists] = stockRoot

  const onEnter: CreateStockFormProps['onEnter'] = async (createStockListFormResult) => {
    const icon = Math.floor(Math.random() * StockIcons.length)
    const createItem = {
      ...createStockListFormResult,
      icon: `${icon}`,
    }
    // optimistic update:
    setStocklists((data) => {
      if (!data) return data
      const index = data.findIndex((entry) => entry.name === createItem.name)
      const newItem = updateStockList(data[index], createItem)
      return index !== -1 ? [...data.slice(0, index), newItem, ...data.slice(index + 1)] : [...data, newItem]
    })

    setMode('none')
    const stocklist = await props.createStocklist({ ...createItem })
    await refetch()
    props.setStocklist(stocklist)
  }

  createEffect(() => {
    if (!props.currentStocklist && mode() === 'editStockList') setMode('none')
  })

  return (
    <section class="container mx-auto px-4 pb-3">
      <nav
        ref={useAutoAnimate()}
        class="grid w-full grid-cols-[40px_auto_40px] gap-4"
        classList={{
          'items-start': mode() !== 'createStockList',
          'items-center': mode() === 'createStockList',
        }}
      >
        <Show when={mode() !== 'editStockList'}>
          <FAB
            class={`m-1 border-secondary-600 text-secondary-600 transition`}
            classList={{
              'rotate-45': mode() === 'createStockList',
            }}
            onClick={() => setMode((mode) => (mode !== 'none' ? 'none' : 'createStockList'))}
          >
            <Add class="h-full w-full" />
          </FAB>
        </Show>

        <Show when={mode() === 'createStockList'}>
          <CreateStockForm onEnter={onEnter} />
        </Show>
        <Show when={mode() === 'none'}>
          <div ref={useAutoAnimate()} class="inline-flex items-center gap-4 overflow-scroll p-1">
            <For each={stocklists()}>
              {(stocklist) => <StockListEntry stocklist={stocklist} onClick={() => props.setStocklist(stocklist)} />}
            </For>
          </div>
        </Show>
        <Show when={props.currentStocklist && mode() !== 'createStockList'}>
          <FAB
            class="m-1 border-secondary-600 text-secondary-600 transition"
            onClick={() => setMode((currentMode) => (currentMode !== 'editStockList' ? 'editStockList' : 'none'))}
          >
            <Settings class="h-[66%] w-[66%]" />
          </FAB>
        </Show>
      </nav>
    </section>
  )
}
