import { createServerData$ } from 'solid-start/server'
import { sessionFromRequest } from '~/env/solid-auth.config'

export const serverSession: Parameters<typeof createServerData$> = [
  (_, { request }) => sessionFromRequest(request),
  { key: () => ['auth_user'] },
]
