// Temporary server file to redirect to frontend
import { createServer } from 'vite'
import path from 'path'

const server = await createServer({
  server: {
    middlewareMode: false,
    port: 5000,
    host: '0.0.0.0',
    allowedHosts: ['all']
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "src"),
      "@assets": path.resolve(process.cwd(), "attached_assets"),
    },
  },
  root: '.',
})

await server.listen()
console.log('Vite dev server running on port 5000')