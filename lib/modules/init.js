const { exec, config } = require('../core')

/**
 * 初始化git
 * @param {Context} ctx
 */
exports.init = async (ctx) => {
  if (!(ctx.config.init || ctx.files.find(i => i.path === '.gitignore') != null)) return

  try {
    const options = {
      cwd: ctx.dest,
      stdio: 'inherit'
    }
    await exec('git', ['init'], options)
    await exec('git', ['add', '--all'], options)
    await exec('git', ['commit', '-m', config.commitMessage], options)
  } catch (error) {
    throw new Error('Initial repository failed.')
  }
}
