import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('..', import.meta.url)))
const port = Number(process.env.PORT || 8124)

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
}

createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname)
    const relative = pathname === '/' ? 'index.html' : pathname.slice(1)
    const filename = extname(relative) ? relative : `${relative}.html`
    const absolute = resolve(root, filename)

    if (!absolute.startsWith(root)) throw new Error('Invalid path')

    const file = await readFile(absolute)
    response.writeHead(200, { 'Content-Type': contentTypes[extname(absolute)] || 'application/octet-stream' })
    response.end(file)
  } catch {
    const file = await readFile(resolve(root, 'index.html'))
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
    response.end(file)
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Aerobridge preview: http://127.0.0.1:${port}`)
})
