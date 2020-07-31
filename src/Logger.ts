export class Logger {
  verbose?: boolean

  constructor({ verbose }: { verbose?: boolean } = {}) {
    this.verbose = verbose
  }

  log(...args: any[]) {
    if (!this.verbose) return

    console.log(...args)
  }
}
