const taki = require('taki')
const chalk = require('chalk')

const handleRoute = route => {
  return route.replace(/\/?$/, '/index.html')
}

module.exports = class Crawler {
  constructor(opts = {}) {
    this.opts = opts
  }

  async crawl() {
    const { hostname, port, options, writer, logger } = this.opts

    const routes = typeof options.routes === 'function' ? (await options.routes()) : options.routes

    const crawlRoute = async routes => {
      const takiOptions = routes.map(route =>
        Object.assign({}, options, {
          url: `http://${hostname}:${port}${route}`,
          onFetch: url => {
            logger.log(`Crawling contents from ${chalk.cyan(url)}`)
          }
        })
      )
      const result = await taki(takiOptions)
      await Promise.all(
        routes.map((route, index) => {
          route = handleRoute(route)
          logger.log(
            `Writing ${chalk.cyan(route)} for ${chalk.cyan(
              takiOptions[index].url
            )}`
          )
          return writer.write({ html: result[index], route })
        })
      )
    }

    await crawlRoute(routes)
  }
}
