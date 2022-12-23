import { z } from 'zod'
import { getOctokit, listRepositories } from '~/server/github'
import { router, protectedProcedure } from '../utils'

export default router({
  repositories: protectedProcedure.query(({ ctx: { user } }) => {
    const githubAccount = user.accounts.find((account) => account.provider === 'github')
    if (!githubAccount?.access_token) throw new Error('Account not connected to github!')

    return listRepositories(getOctokit(githubAccount.access_token))
  }),
})
