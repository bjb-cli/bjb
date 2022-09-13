const os = require('os')
const fs = require('fs')
const path = require('path')

/**
 * 获取fixtures文件路径
 * @param target 相对路径
 * @returns 绝对路径
 */
exports.fixture = (target) => {
  return path.join(__dirname, 'fixtures', target)
}

/**
 * 检测文件是否存在
 * @param input
 * @returns true if input is exists
 */
exports.exists = async (input) => {
  return await fs.promises.access(input).then(() => true).catch(() => false)
}

/**
 * 创建模板目录
 * @returns 模板路径
 */
exports.mktmpdir = async () => {
  return await fs.promises.mkdtemp(path.join(os.tmpdir(), 'bjb-test-'))
}

/**
 * 强制删除文件
 * @param target
 */
exports.destory = async (...target) => {
  for (const item of target) {
    // cleanup require node >= v14.14.0
    await fs.promises.rm(item, { recursive: true, force: true })
  }
}

/**
 * 创建上下文
 * @param context
 * @param config
 * @returns Context
 */
exports.context = (context, config) => ({
  template: 'uzi',
  project: 'uzi',
  options: {},
  src: path.join(__dirname, 'fixtures'),
  dest: path.join(__dirname, '.temp'),
  config: { name: 'uzi', ...config },
  answers: {},
  files: [],
  ...context
})
