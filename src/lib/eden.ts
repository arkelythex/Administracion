import { edenTreaty } from '@elysiajs/eden'
import type { App } from '@server/index'

export const client = edenTreaty<App>('http://localhost:3000')
