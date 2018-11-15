#!/usr/bin/env node
const path = require('path')
const cac = require('cac')
const loudRejection = require('loud-rejection')
const chalk = require('chalk')
const update = require('update-notifier')
const UseConfig = require('use-config')
const pkg = require('../package')

update({ pkg }).notify()

loudRejection()

const cli = cac()

cli
  .command(
    '*',
    {
      desc: 'Prerender your website',
      examples: ['$ presite ./dist', '$ presite ./dist -o ./static-html']
    },
    (input, flags) => {
      // eslint-disable-next-line import/order
      const Server = require('../lib/Server')
      const Crawler = require('../lib/Crawler')
      const Writer = require('../lib/Writer')
      const Logger = require('../lib/Logger')

      const cliOptions = flags

      if (input[0]) {
        cliOptions.baseDir = input[0]
      }

      let server
      let options
      let writer
      let logger

      const useConfig = new UseConfig({
        name: 'presite',
        files: ['package.json', '{name}.json']
      })

      useConfig
        .load()
        .then(({ config, path: configPath }) => {
          if (configPath) {
            console.log(
              `Using config from ${chalk.green(
                path.relative(process.cwd(), configPath)
              )}`
            )
          }
          options = Object.assign(
            {
              outDir: '.presite',
              routes: ['/']
            },
            config,
            cliOptions
          )

          if (!options.baseDir) {
            throw new Error('Please provide the path to your SPA!')
          }

          logger = new Logger({ verbose: !options.quiet })

          server = new Server({
            baseDir: options.baseDir
          })

          writer = new Writer({
            outDir: options.outDir
          })

          return Promise.all([server.start(), writer.copyFrom(options.baseDir)])
        })
        .then(() => {
          const crawler = new Crawler({
            hostname: server.hostname,
            port: server.port,
            options,
            writer,
            logger
          })

          return crawler.crawl()
        })
        .then(() => {
          server && server.stop()
          logger.log(`Done, check out ${chalk.green(options.outDir)} folder`)
          process.exit()
        })
        .catch(error => {
          console.error(error.stack)
          server && server.stop()
          process.exit(1)
        })
    }
  )
  .option('wait', {
    desc: 'Wait for specific ms or dom element to appear'
  })
  .option('manually', {
    desc: 'Manually set ready state in your app',
    alias: 'm'
  })
  .option('minify', {
    desc: 'Minify HTML'
  })
  .option('routes', {
    desc: 'An array of routes to crawl contents from',
    alias: 'r'
  })
  .option('out-dir', {
    desc: 'The directory to output files',
    alias: ['o', 'd']
  })
  .option('quiet', {
    desc: 'Output nothing in console',
    alias: 'q'
  })

cli.parse()
