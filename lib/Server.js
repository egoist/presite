const express = require('express')
const getPort = require('get-port')
const historyAPIFallback = require('connect-history-api-fallback')

module.exports = class Server {
  constructor(opts = {}) {
    this.app = express()
    this.hostname = '127.0.0.1'
    this.opts = opts

    this.app.use(historyAPIFallback())
    this.app.use('/', express.static(this.opts.baseDir))
  }

  start() {
    return getPort().then(port => {
      this.port = port
      return new Promise((resolve, reject) => {
        this.instance = this.app.listen(this.port, this.hostname, err => {
          if (err) return reject(err)
          resolve()
        })
      })
    })
  }

  stop() {
    return this.instance && this.instance.close()
  }
}
