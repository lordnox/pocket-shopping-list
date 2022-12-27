import { ErrorBoundary, Title } from 'solid-start'

import { trpc, QueryResult } from '~/utils/trpc-client'
import { createSignal, For, JSX, onMount, Show } from 'solid-js'

export default () => {
  let textElement: HTMLInputElement | null = null
  let numberElement: HTMLInputElement | null = null
  const upsertItem = trpc.createOrUpdateShoppingItem.mutate
  const [items, setItems] = createSignal<QueryResult<'shoppingItems'>>()

  onMount(async () => setItems(await trpc.shoppingItems.query()))

  const enterItem: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> = async (event) => {
    event.preventDefault()
    if (!textElement || !numberElement) throw new Error('Could not correctly identify form elements')
    const name = textElement.value
    const price = parseInt(numberElement.value)
    // textElement.value = ''
    // numberElement.value = ''
    console.log(`Creating shopping Item: ${JSON.stringify({ name, price })}`)
    const result = await upsertItem({ name, price })
    const currentItems = await trpc.shoppingItems.query()
    setItems(currentItems)
    console.log('Done creating an item')
  }
  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <Title class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Shopping</Title>
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">Shopping</h1>
      <form class="shadow-lg w-full grid justify-start">
        <div class="form-element w-full flex">
          <label class="w-48">Name</label>
          <input ref={textElement!} type="text" placeholder="Name" value={'Hello'} />
        </div>
        <div class="form-element w-full flex">
          <label class="w-48">Preis</label>
          <input ref={numberElement!} type="number" placeholder="Preis" value={123} />
        </div>
        <button type="submit" onClick={enterItem}>
          Eintragen
        </button>
      </form>
      <hr />
      <For each={items()}>
        {(item) => (
          <div>
            {item.name} - {item.prices.map((price) => price.price).join(', ')}
          </div>
        )}
      </For>
    </main>
  )
}
