const path = require('path')
// 实现加密和解密的模块，使用OpenSSL类库作为内部实现加密解密
const crypto = require('crypto')
const ora = require('ora')
const chalk = require('chalk')
const { file, http, config } = require('../core')

/**
 * 获取本地模板路径
 * @param {String} input 模板路径
 * @returns string
 * @example
 * 1. 相对路径, e.g. './foo', '../foo'
 * 2. 绝对路径, e.g. '/foo', 'C:\\foo'
 * 3. ~路径, e.g. '~/foo'
 */
exports.getTemplatePath = async (input) => {
  // todo: test
  if (!/^[./]|^[a-zA-Z]:|^~[/\\]/.test(input)) return false

  // 解析~
  const dir = path.resolve(file.untildify(input))

  if (await file.exists(dir) === 'dir') return dir

  throw new Error(`Local template not found: \`${input}\` is not a directory`)
}

/**
 * 获取远程模板url
 * @param {String} input 模板名称或则uri
 * @returns string
 * @example
 * 1. 短名称, e.g. 'nm',
 * 2. 全名称, e.g. 'bjb-cli/nm'
 * 3. 有分支信息, e.g, 'bjb-cli/nm#next'
 * 4. 完整的url, e.g. 'https://github.com/bjb-cli/nm/archive/master.zip'
 */
// todo: test
exports.getTemplateUrl = async (input) => {
  if (/^https?:/.test(input)) return input

  const [fullname, maybeBranch] = input.split('#')
  const [maybeOwner, maybeName] = fullname.split('/')

  const isEmpty = (input) => input == null || input === ''

  const branch = isEmpty(maybeBranch) ? config.branch : maybeBranch
  const name = isEmpty(maybeName) ? maybeOwner : maybeName
  const owner = isEmpty(maybeName) ? config.official : maybeOwner

  const data = {
    owner,
    name,
    branch
  }
  return config.registry.replace(/{(\w+)}/g, (_, key) => data[key])
}

// todo: test
exports.resolve = async (ctx) => {
  // 获取本地模板Path
  const dir = await this.getTemplatePath(ctx.template)

  if (dir !== false) {
    ctx.src = dir
    return
  }

  // 获取远程模板Url
  // https://github.com/bjb-cli/nm/archive/refs/heads/master.zip
  const url = await this.getTemplateUrl(ctx.template)

  // url hash处理
  const hash = crypto.createHash('md5').update(url).digest('hex').substring(8, 24)

  // 模板缓存路径
  ctx.src = path.join(config.paths.cache, hash)

  // 检测模板缓存是否存在
  const exists = await file.isDirectory(ctx.src)

  if (ctx.options.offline != null && ctx.options.offline) {
    // 离线模式
    if (exists) {
      // 模板已存在
      return console.log(chalk.green(`Using cached template: \`${file.tildify(ctx.src)}\`.`))
    }
    console.log(chalk.redBright(`Cache not found: \`${file.tildify(ctx.src)}\`.`))
  }

  // 清除缓存
  exists && await file.remove(ctx.src)

  const spinner = ora('Downloading template...').start()

  try {
    // 下载远程模板
    const temp = await http.download(url)
    // 解压
    await file.extract(temp, ctx.src, 1)
    // 删除压缩包
    await file.remove(temp)
    spinner.succeed('Download template complete.')
  } catch (error) {
    spinner.stop()
    throw new Error(`Failed to pull \`${ctx.template}\` template: ${error.message}.`)
  }
}
