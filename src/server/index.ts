import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { routes } from './routes'

const app = new Elysia()
  .use(cors())
  .use(routes)
  .listen(3000)

console.log(`Server running on http://localhost:${app.server?.port}`)

export type App = typeof app