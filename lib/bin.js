const cac = require('cac')
const { main, list } = require('../')

const { name, version } = require('../package.json')

/**
 * @type {import('cac').CAC}
 */
const cli = cac(name)

const onError = (err) => {
  cli.options.debug && console.error(err)
  console.error('Exception occurred: ', err.message)
  process.exit(1)
}

try {
  cli
    .command('<template> [project]', 'Create new project(default: my-project) from a template')
    .option('-f, --force', 'Overwrite if the target exists')
    .option('-o, --offline', 'Try to use an offline template')
    .option('-i, --install', 'Automatic install template dependencies.')
    .allowUnknownOptions()
    .example('  # with an official template')
    .example(`  $ ${name} <template> [project]`)
    .example('  # with a custom github repo')
    .example(`  $ ${name} <owner>/<repo> [peoject]`)
    .action(main)

  cli
    .command('list [owner]', 'Show all available templates')
    .alias('ls')
    .option('-j, --json', 'Output with json format')
    .option('-s, --short', 'Outpt with short format')
    .action(list)

  cli.help().version(version).parse()
} catch (error) {
  onError(error)
}

process.on('uncaughtException', onError)
process.on('unhandledRejection', onError)
