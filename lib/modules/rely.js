const ora = require('ora')
const path = require('path')
const fs = require('fs')
const { exec } = require('../core')
exports.rely = async (ctx) => {
  ctx.config.name = ctx.template

  try {
    const mod = require(ctx.src)
    if (Object.prototype.toString.call(mod) !== '[object Object]') {
      throw new TypeError('template needs to expose an object.')
    }
    Object.assign(ctx.config, mod)
  } catch (error) {
    if (error.code === 'MODULE_NOT_FOUND') return
    error.message = `Invalid template: ${error.message}`
    throw error
  }

  const { dependencies } = require(path.join(ctx.src, 'package.json'))
  if (dependencies == null || Object.keys(dependencies).length === 0) {
    return
  }
  const nodeModulePath = path.join(ctx.src, 'node_modules')
  if (fs.existsSync(nodeModulePath)) {
    const mustInstall = Object.keys(dependencies).some(dependName => {
      const dependVersion = dependencies[dependName]
      if (!fs.existsSync(path.join(nodeModulePath, dependName))) return false
      let dependJson = fs.readFileSync(path.join(nodeModulePath, dependName, 'package.json'))
      dependJson = JSON.parse(dependJson)
      if (dependVersion.indexOf(dependJson.version) < 0) return true
      return false
    })
    if (!mustInstall) return
  }
  // 自动安装模板依赖
  const spinner = ora('Installing template dependencies...').start()
  try {
    const cmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
    await exec(cmd, ['install', '--production'], { cwd: ctx.src })
    spinner.succeed('Installing template dependencies complete.')
  } catch {
    spinner.fail('Install template dependencies failed.')
  }
}
