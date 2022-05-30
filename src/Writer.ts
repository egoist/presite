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
    return (
      /* TODO: JSFIX could not patch the breaking change:
      Allow copying broken symlinks 
      Suggested fix: You can use the exists and existsSync functions https://nodejs.org/api/fs.html#fsexistspath-callback from the fs module to check if a symlink is broken. */
      fs.copy(from, outDir)
    )
  }
}
