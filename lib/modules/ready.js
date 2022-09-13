const prompts = require('prompts')
const path = require('path')
const { file } = require('../core')

exports.ready = async (ctx) => {
  ctx.project = ctx.project || ctx.template
  ctx.dest = path.resolve(ctx.project)

  // exist
  const exists = await file.exists(ctx.dest)

  // 文件不存在则不作处理
  // todo: test
  if (exists === false) return

  // 目标目录不是文件夹时抛出错误
  // todo: test
  if (exists !== 'dir') {
    throw new Error(`Cannot create ${ctx.project}: it is a file and exists.`)
  }

  // 文件夹为空则不作处理
  // todo: test
  if (await file.isEmpty(ctx.dest)) return

  // 参数force为true时，删除文件
  // todo: test
  if (ctx.options.force) {
    return await file.remove(ctx.dest)
  }

  // 判断目标目录是否是命令执行路径
  const isCurrent = ctx.dest === process.cwd()

  // 确定问题
  // todo: test
  const { choose } = await prompts([
    {
      name: 'sure',
      type: 'confirm',
      message: isCurrent ? 'Create in current directory' : 'Target directory already exists. Continue?'
    },
    {
      name: 'choose',
      type: prev => prev ? 'select' : null,
      message: `${isCurrent ? 'Current' : 'Target'} directory is not empty. How to continue?`,
      hint: ' ',
      choices: [
        { title: 'Merge', value: 'merge' },
        { title: 'Overwrite', value: 'overwrite' },
        { title: 'Cancel', value: 'cancel' }
      ]
    }
  ])

  if (choose == null || choose === 'cancel') {
    throw new Error('You have cancelled this task.')
  }

  if (choose === 'overwrite') {
    await file.remove(ctx.dest)
  }
}
