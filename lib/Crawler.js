const taki = require('taki')

module.exports = class Crawler {
  constructor(opts = {}) {
    this.opts = opts
  }

  crawl() {
    const { hostname, port, options, writer, logger } = this.opts

    const routes = options.routes

    return Promise.all(
      routes.map(route => {
        logger.log(`Crawling ${route}`)
        return taki(
          Object.assign({}, options, {
            url: `http://${hostname}:${port}${route}`
          })
        ).then(html => {
          logger.log(`Writing ${route}`)
          return writer.write({ html, route })
        })
      })
    )
  }
}
