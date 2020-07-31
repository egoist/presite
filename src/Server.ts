import { Server as HttpServer } from 'http'
import polka from 'polka'
import getPort from 'get-port'
import historyAPIFallback from 'connect-history-api-fallback'
import serveStatic from 'serve-static'

type ServerOptions = {
  baseDir: string
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
    this.app.use('/', serveStatic(this.opts.baseDir))
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
