import { Accessor, createEffect, createRenderEffect, createSignal, onMount } from 'solid-js'
import { isServer } from 'solid-js/web'
import { CompareFn, updateCurrentItemList } from './list-comparison'

const readStorage = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? '')
  } catch (e) {
    return undefined
  }
}

const writeStorage = (key: string, value: any) => localStorage.setItem(key, JSON.stringify(value))

export const cacheDefined = <Type>(key: string, getter: Accessor<Type>): Accessor<Type> => {
  if (isServer) return getter
  const [cache, setCache] = createSignal<Type>(getter())
  onMount(() => setCache(readStorage(key)))

  createEffect(() => {
    const data = getter()
    // ignore caching undefined values
    if (typeof data === 'undefined') return
    setCache(() => data)
    writeStorage(key, data)
  })

  return cache
}

export const compareCache = <Type extends { id: string; name: string }>(
  accessor: Accessor<undefined | Type[]>,
  compareFn: CompareFn<Type>,
): Accessor<Type[]> => {
  let cache: Type[] | undefined = []
  return () => {
    const items = accessor() ?? []
    if (!cache || !items) return (cache = items) as Type[]
    return (cache = updateCurrentItemList(cache, items, compareFn))
  }
}
// type NotFunction<T> = T extends Function ? never : T
// type MaybeAccessor<Type> = NotFunction<Type> extends Type ? Accessor<Type> | Type : never
// const resolveMaybeAccessor = <Type>(maybe: MaybeAccessor<Type>) => (typeof maybe === 'function' ? maybe() : () => maybe)

export const createFilter =
  <Type>(accessor: Accessor<undefined | Type[]>, filterFn: (item: Type) => boolean): Accessor<Type[]> =>
  () =>
    accessor()?.filter(filterFn) ?? []

export const createSorter =
  <Type>(accessor: Accessor<undefined | Type[]>, sortFn?: (a: Type, b: Type) => number): Accessor<Type[]> =>
  () => {
    const currentItems = accessor() ?? []
    currentItems.sort(sortFn)
    return currentItems
  }
