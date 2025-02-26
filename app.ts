import { apiReference } from '@scalar/hono-api-reference'
import { Hono } from 'hono'
import { openAPISpecs } from 'hono-openapi'
import { logger } from 'hono/logger'
import { tasksRoute } from './routes/tasks'

const app = new Hono()

app.use('*', logger())

app.get('/', (c) => {
  return c.json({ message: 'Hello, World!' })
})

app.route('/api/tasks', tasksRoute)

app.get(
  '/openapi',
  openAPISpecs(app, {
    documentation: {
      info: {
        title: 'Hono API',
        version: '1.0.0',
        description: 'Tasks API',
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Local Server' },
      ],
    },
  }),
)

app.get(
  '/docs',
  apiReference({
    theme: 'deepSpace',
    spec: { url: '/openapi' },
  }),
)

export default app
