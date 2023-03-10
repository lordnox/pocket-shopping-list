import { Session } from '@auth/core'
import { createRoot, createSignal } from 'solid-js'

const sessionUrl = `/api/session`

type INITIAL_STATE = { state: 'INITIAL' }
type LOADING_STATE = { state: 'LOADING' }
export type LOADED_STATE = { state: 'LOADED'; data: Session | null }

type STATE = INITIAL_STATE | LOADING_STATE | LOADED_STATE

const [currentSession, setCurrentSession] = createRoot(() =>
  createSignal<STATE>({
    state: 'INITIAL',
  }),
)

export const useSession = () => {
  const session = currentSession()
  if (session.state === 'INITIAL') {
    setCurrentSession({ state: 'LOADING' })
    fetch(sessionUrl)
      .then(async (response) =>
        setCurrentSession({
          state: 'LOADED',
          data: await response.json(),
        }),
      )
      .catch((e) =>
        setCurrentSession({
          state: 'LOADED',
          data: null,
        }),
      )
  }

  return currentSession
}

export const session = () => (currentSession() as LOADED_STATE)?.data
export const isAuthenticated = () => !!(currentSession() as LOADED_STATE)?.data
