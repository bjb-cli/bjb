const os = require('os')
const fs = require('fs')
const path = require('path')
// node.js 的 ini 格式解析器和序列化器。
const ini = require('ini')
// Get paths for storing things like data, config, cache, etc
const envPaths = require('env-paths')
const { name } = require('../../package.json')

/**
 * 解析ini文件
 * @param {String} filename
 * @returns Record
 */
const parseIni = (filename) => {
  try {
    return ini.parse(fs.readFileSync(filename, 'utf-8'))
  } catch {
    return {}
  }
}

const defaults = {
  // 模板下载地址
  // {owner} & {name} & {branch}
  registry: 'https://github.com/{owner}/{name}/archive/refs/heads/{branch}.zip',
  // 拉取模板列表
  list: 'https://api.github.com/users/{owner}/repos',
  // 默认owner名称
  official: 'bjb-cli',
  // 默认分支
  branch: 'master',
  // 下载代理配置
  proxy: undefined,
  // git初始提交信息
  commitMessage: 'feat: initial commit'
}

const config = parseIni(path.join(os.homedir(), `.${name}rc`)) || {}

const bjbConfig = parseIni(path.join(__dirname, '../../', `.${name}rc`)) || {}

// 代理配置
const envProxy = process.env.http_proxy || process.env.HTTP_PROXY || process.env.https_proxy || process.env.HTTPS_PROXY || process.env.ALL_PROXY
config.proxy = envProxy || config.proxy

if (process.env.no_proxy != null || process.env.NO_PROXY != null) {
  // 禁止代理
  delete config.proxy
}

module.exports = {
  ...defaults,
  ...config,
  ...bjbConfig,
  get npm () {
    return parseIni(path.join(os.homedir(), '.npmrc'))
  },
  get git () {
    return parseIni(path.join(os.homedir(), '.gitconfig'))
  },
  get paths () {
    return envPaths(name, { suffix: '' })
  },
  ini: parseIni
}
