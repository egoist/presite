import { Server as HttpServer } from 'http'
import { join } from 'path'
import fs from 'fs-extra'
import polka from 'polka'
import getPort from 'get-port'
import historyAPIFallback from 'connect-history-api-fallback'
import serveStatic from 'serve-static'
import { SPECIAL_EXTENSIONS_RE } from './Crawler'

type ServerOptions = {
  baseDir: string
  outDir: string
}

export class Server {
  app: polka.Polka
  hostname: string
  opts: ServerOptions
  port?: number
  server?: HttpServer

  constructor(opts: ServerOptions) {
    this.app = polka()
    this.hostname = 'localhost'
    this.opts = opts

    this.app.use(historyAPIFallback())
    this.app.use(serveStatic(this.opts.baseDir))
    this.app.use(async (req, res, next) => {
      if (!SPECIAL_EXTENSIONS_RE.test(req.path)) {
        return next()
      }
      const file = join(this.opts.baseDir, req.path + '.js')
      if (await fs.pathExists(file)) {
        // Remove copied original file in output directory
        // e.g. /feed.xml should remove original feed.xml.js in output directory
        await fs.remove(join(this.opts.outDir, req.path + '.js'))
        res.setHeader('content-type', 'text/html')
        res.end(`

      <html>
      <body>
      <script id="__presite_script__" type="module">
      import getContent from "${req.path + '.js'}"
      document.addEventListener('DOMContentLoaded', () => {
        Promise.resolve(getContent()).then(content => {
          window.snapshot({
            content: typeof content === 'string' ? content : JSON.stringify(content)
          });
        })
      })
      </script>
      </body>
      </html>
        `)
        return
      }
      next()
    })
  }

  async start(): Promise<void> {
    const port = await getPort()
    this.port = port
    this.server = new HttpServer(this.app.handler as any)
    this.server.listen(this.port!, this.hostname)
  }

  stop() {
    return this.server && this.server.close()
  }
}
