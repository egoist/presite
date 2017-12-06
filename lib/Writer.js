const path = require('path')
const fs = require('fs-extra')

module.exports = class Writer {
  constructor(opts = {}) {
    this.opts = opts
  }

  write({ route, html }) {
    const { outDir } = this.opts
    const filepath = path.join(outDir, route)
    return fs
      .ensureDir(path.dirname(filepath))
      .then(() => fs.writeFile(filepath, html, 'utf8'))
  }

  copyFrom(from) {
    from = path.resolve(from)
    const outDir = path.resolve(this.opts.outDir)
    if (from === outDir) return Promise.resolve()
    return fs.copy(from, outDir)
  }
}
