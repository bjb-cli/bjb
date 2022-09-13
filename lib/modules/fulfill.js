const chalk = require('chalk')
exports.fallback = async (ctx) => {
  console.log(chalk.green(`Created a new project in \`${ctx.project}\` by the \`${ctx.template}\` template.\n`))
  ctx.files.map(i => i.path).sort((a, b) => a > b ? +1 : -1).forEach(i => console.log(chalk.blue(`- ${i}\n`)))
  console.log(chalk.green.bold('Happy hacking :)'))
}

exports.fulfill = async (ctx) => {
  if (ctx.config.fulfill == null) {
    return await this.fallback(ctx)
  }

  if (typeof ctx.config.fulfill === 'string') {
    return console.log(chalk.green(ctx.config.fulfill))
  }

  const result = await ctx.config.fulfill(ctx)
  if (result == null) return
  console.log(chalk.green(result))
}
