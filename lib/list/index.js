const chalk = require('chalk')
const fetch = require('./fetch')
const { config } = require('../core')

exports.list = async (owner = config.official, options) => {
  let results = await fetch(owner)

  // json
  if (options?.json || false) {
    results = results.filter(item => {
      return item.name !== 'bjb'
    })
    return console.log(chalk.green(JSON.stringify(results, null, 2)))
  }

  // short
  if (options?.short || false) {
    return results.forEach(i => console.log(chalk.green((`→ ${i.name}`))))
  }

  // full mode
  if (results.length === 0) {
    return console.log(chalk.redBright('No available templates.'))
  }

  console.log(chalk.green('Available official\'s templates:'))
  const infos = results.map(i => [i.name, i.description])
  const width = Math.max(5, ...infos.map(i => i[0].length))
  const gap = (name) => ' '.repeat(width - name.length)
  infos.forEach(([name, desc]) => console.log(chalk.green(`  → ${name} ${gap(name)} ${desc}`)))
}
