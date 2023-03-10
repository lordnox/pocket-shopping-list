import { createTRPCProxyClient, httpLink } from '@trpc/client'
import { createSignal, onMount } from 'solid-js'

import type {
  AnyProcedure,
  AnyRouter,
  inferRouterInputs,
  inferRouterOutputs,
  ProcedureArgs,
  ProcedureType,
} from '@trpc/server'
import type { AppRouter } from '~/server/trpc/router/_app'
import { inferTransformedProcedureOutput } from '@trpc/server/shared'

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>

export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpLink({
      url: `/api/trpc`,
      headers: () => {
        // cache request for 1 day + revalidate once every second
        const ONE_DAY_IN_SECONDS = 60 * 60 * 24
        return {
          'cache-control': `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
        }
      },
    }),
  ],
})

type InferProcedureTypeKey<TProcedureType extends ProcedureType, TRouter extends AnyRouter> = {
  [Key in keyof TRouter['_def']['procedures']]: TRouter['_def']['procedures'][Key]['_type'] extends TProcedureType
    ? Key
    : never
}[keyof TRouter['_def']['procedures']]

type InferProcedureType<TProcedureType extends ProcedureType, TRouter extends AnyRouter> = {
  [Key in InferProcedureTypeKey<TProcedureType, TRouter>]: TRouter['_def']['procedures'][Key]
}

type Queries = InferProcedureType<'query', AppRouter>
// type Mutations = InferProcedureType<'mutation', AppRouter>
// type Subscriptions = InferProcedureType<'subscription', AppRouter>

const queries: Queries = null as any
// const mutations: Mutations = null as any
// const subscriptions: Subscriptions = null as any

type QueryKeys = keyof Queries & string
// type MutationKeys = keyof Mutations & string
// type SubscriptionKeys = keyof Subscriptions & string

type Resolver<TProcedure extends AnyProcedure> = (
  ...args: ProcedureArgs<TProcedure['_def']>
) => Promise<inferTransformedProcedureOutput<TProcedure>>

export const useQuery = <TPath extends QueryKeys>(path: TPath, ...params: ProcedureArgs<Queries[TPath]['_def']>) => {
  type Data = RouterOutput[TPath]
  // type Data = inferTransformedProcedureOutput<Queries[TPath]>
  const [data, setData] = createSignal<Data>()
  const query = trpc[path].query as Resolver<Queries[TPath]>

  const fetch = async () => {
    const result = await query(...params)
    setData(() => result as any)
  }

  onMount(fetch)
  return [data, fetch, setData] as const
}

export type QueryResult<Path extends QueryKeys> = inferTransformedProcedureOutput<Queries[Path]>
