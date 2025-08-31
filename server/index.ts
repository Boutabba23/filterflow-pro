// Temporary server file to redirect to frontend
import { createServer } from 'vite'

const server = await createServer({
  server: {
    middlewareMode: false,
    port: 5000,
    host: '0.0.0.0'
  },
  root: '.',
})

await server.listen()
console.log('Vite dev server running on port 5000')