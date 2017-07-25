const taki = require('taki')
const chalk = require('chalk')

const handleRoute = route => {
  return route.replace(/\/?$/, '/index.html')
}

module.exports = class Crawler {
  constructor(opts = {}) {
    this.opts = opts
  }

  crawl() {
    const { hostname, port, options, writer, logger } = this.opts

    const routes = options.routes

    const crawlRoute = routes => {
      const url = routes.map(route => `http://${hostname}:${port}${route}`)
      return taki(
        Object.assign(
          {
            onStart: url => {
              logger.log(`Crawling contents from ${chalk.cyan(url)}`)
            }
          },
          options,
          {
            url
          }
        )
      ).then(result => {
        return Promise.all(
          routes.map((route, index) => {
            route = handleRoute(route)
            logger.log(
              `Writing ${chalk.cyan(route)} for ${chalk.cyan(url[index])}`
            )
            return writer.write({ html: result[index], route })
          })
        )
      })
    }

    return crawlRoute(routes)
  }
}
