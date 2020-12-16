import { parse as parseUrl } from 'url'
import { request, cleanup } from 'taki'
import chalk from 'chalk'
import { PromiseQueue } from '@egoist/promise-queue'
import { Writer } from './Writer'
import { Logger } from './Logger'
import { Page } from 'puppeteer-core'

export const SPECIAL_EXTENSIONS_RE = /\.(xml|json)$/

const routeToFile = (route: string) => {
  if (/\.html$/.test(route) || SPECIAL_EXTENSIONS_RE.test(route)) {
    return route
  }
  return route.replace(/\/?$/, '/index.html')
}

type CrawlerOptions = {
  hostname: string
  port: number
  options: {
    routes: string[] | (() => Promise<string[]>)
    onBrowserPage?: (page: Page) => void | Promise<void>
    manually?: string | boolean
    linkFilter?: (url: string) => boolean
  }
  writer: Writer
  logger: Logger
}

export class Crawler {
  opts: CrawlerOptions

  constructor(opts: CrawlerOptions) {
    this.opts = opts
  }

  async crawl() {
    const { hostname, port, options, writer, logger } = this.opts

    const routes =
      typeof options.routes === 'function'
        ? await options.routes()
        : options.routes

    const crawlRoute = async (routes: string[]) => {
      const queue = new PromiseQueue(
        async (route: string) => {
          const file = routeToFile(route)
          let links: Set<string> | undefined
          const html = await request({
            url: `http://${hostname}:${port}${route}`,
            onBeforeRequest(url) {
              logger.log(`Crawling contents from ${chalk.cyan(url)}`)
            },
            async onBeforeClosingPage(page) {
              links = new Set(
                await page.evaluate(
                  ({ hostname, port }: { hostname: string; port: string }) => {
                    return Array.from(document.querySelectorAll('a'))
                      .filter((a) => {
                        return a.hostname === hostname && a.port === port
                      })
                      .map((a) => a.pathname)
                  },
                  { hostname, port: String(port) }
                )
              )
            },
            manually: SPECIAL_EXTENSIONS_RE.test(route)
              ? true
              : options.manually,
            async onCreatedPage(page) {
              if (options.onBrowserPage) {
                await options.onBrowserPage(page)
              }
              page.on('console', (e) => {
                const type = e.type()
                // @ts-ignore
                const log = console[type] || console.log
                const location = e.location()
                log(
                  `Message from ${location.url}:${location.lineNumber}:${location.columnNumber}`,
                  e.text()
                )
              })
            },
          })

          if (links && links.size > 0) {
            const filtered = options.linkFilter
              ? Array.from(links).filter(options.linkFilter)
              : links

            for (const link of filtered) {
              queue.add(link)
            }
          }

          logger.log(`Writing ${chalk.cyan(file)} for ${chalk.cyan(route)}`)
          await writer.write({ html, file })
        },
        { maxConcurrent: 50 }
      )
      for (const route of routes) {
        queue.add(route)
      }
      await queue.run()
    }

    await crawlRoute(routes)
    await cleanup()
  }
}
