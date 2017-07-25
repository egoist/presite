const taki = require('taki')
const series = require('promise.series')

module.exports = class Crawler {
  constructor(opts = {}) {
    this.opts = opts
  }

  crawl() {
    const { hostname, port, options, writer, logger } = this.opts

    const routes = options.routes

    const crawlRoute = route => {
      logger.log(`Crawling ${route}`)
      return taki(
        Object.assign({}, options, {
          url: `http://${hostname}:${port}${route}`
        })
      ).then(html => {
        logger.log(`Writing ${route}`)
        return writer.write({ html, route })
      })
    }

    if (options.browser === 'jsdom') {
      return Promise.all(routes.map(route => crawlRoute(route)))
    }

    // Chrome can only run in series
    return series(routes.map(route => () => crawlRoute(route)))
  }
}
