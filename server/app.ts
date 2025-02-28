import { apiReference } from '@scalar/hono-api-reference'
import { Hono } from 'hono'
import { openAPISpecs } from 'hono-openapi'
import { serveStatic } from 'hono/bun'
import { logger } from 'hono/logger'
import { tasksRoute } from './routes/tasks'

const app = new Hono()

app.use('*', logger())

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

// Frontend

app.get('*', serveStatic({ root: './frontend/dist' }))
app.get('*', serveStatic({ path: './frontend/dist/index.html' }))

export default app
