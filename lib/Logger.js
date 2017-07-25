module.exports = class Logger {
  constructor({ verbose } = {}) {
    this.verbose = verbose
  }

  log(...args) {
    if (!this.verbose) return

    console.log(...args)
  }
}
