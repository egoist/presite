const taki = require('taki')
const chalk = require('chalk')
const minifier = require('html-minifier')

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
      const takiOptions = routes.map(route =>
        Object.assign({}, options, {
          url: `http://${hostname}:${port}${route}`,
          onFetch: url => {
            logger.log(`Crawling contents from ${chalk.cyan(url)}`)
          }
        })
      )
      return taki(takiOptions).then(result => {
        return Promise.all(
          routes.map((route, index) => {
            route = handleRoute(route)
            logger.log(
              `Writing ${chalk.cyan(route)} for ${chalk.cyan(
                takiOptions[index].url
              )}`
            )
            const html = options.minify
              ? minifier.minify(result[index], {
                  minifyCSS: true,
                  minifyJS: true,
                  collapseWhitespace: true,
                  decodeEntities: true,
                  removeComments: true,
                  removeAttributeQuotes: true,
                  removeScriptTypeAttributes: true,
                  removeRedundantAttributes: true,
                  removeStyleLinkTypeAttributes: true
                })
              : result[index]
            return writer.write({ html, route })
          })
        )
      })
    }

    return crawlRoute(routes)
  }
}
