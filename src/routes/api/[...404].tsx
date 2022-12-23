import { ApiHandler } from 'solid-start/api/types'

const handler: ApiHandler = (event) => {
  return new Response(
    JSON.stringify({
      error: 'Not found',
      url: event.request.url,
    }),
    {
      status: 404,
    },
  )
}

export const GET = handler
export const POST = handler
