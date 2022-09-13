const { exec } = require('../core')

/**
 * 执行 `npm | yarn install` 命令
 * @param {Context} ctx
 */
exports.install = async (ctx) => {
  if (ctx.config.install === false) return

  if (ctx.config.install == null) {
    // 不包含package.json退出安装
    if (ctx.files.find(i => i.path === 'package.json') == null) return
    ctx.config.install = 'npm'
  }

  // 安装模板依赖
  try {
    const client = ctx.config.install
    const cmd = process.platform === 'win32' ? client + '.cmd' : client
    await exec(cmd, ['install'], { cwd: ctx.dest, stdio: 'inherit' })
  } catch (error) {
    throw new Error('Install dependencies failed.')
  }
}
