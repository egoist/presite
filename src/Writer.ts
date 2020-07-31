import path from 'path'
import fs from 'fs-extra'

type WriterOptions = {
  outDir: string
}

export class Writer {
  opts: WriterOptions

  constructor(opts: WriterOptions) {
    this.opts = opts
  }

  write({ file, html }: { file: string; html: string }) {
    const { outDir } = this.opts
    const filepath = path.join(outDir, file)
    return fs
      .ensureDir(path.dirname(filepath))
      .then(() => fs.writeFile(filepath, html, 'utf8'))
  }

  copyFrom(from: string) {
    from = path.resolve(from)
    const outDir = path.resolve(this.opts.outDir)
    if (from === outDir) return Promise.resolve()
    return fs.copy(from, outDir)
  }
}
