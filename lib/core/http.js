const { join } = require('path')
const { pipeline } = require('stream')
const { promisify } = require('util')
const { promises: fs, createWriteStream } = require('fs')
// A light-weight module that brings window.fetch to Node.js
const fetch = require('node-fetch')
// A SOCKS proxy http.Agent implementation for HTTP and HTTPS
const { SocksProxyAgent } = require('socks-proxy-agent')
const config = require('./config')

// 使用pipeline可以将一系列的流和生成器函数通过管道一起传送，并在管道完成时获取通知
const pipe = promisify(pipeline)

// 封装请求
exports.request = async (url, init = {}) => {
  if (config.proxy != null) {
    init.agent = new SocksProxyAgent(config.proxy)
  }
  const response = await fetch(url, init)
  // res.status >= 200 && res.status < 300
  if (response.ok) {
    return response
  }
  throw Error(`Unexpected response: ${response.statusText}`)
}

exports.download = async (url) => {
  const response = await this.request(url)
  if (response.body == null) {
    throw Error('Unexpected response: Response body is empty')
  }
  await fs.mkdir(config.paths.temp, { recursive: true })
  const filename = join(config.paths.temp, Date.now().toString() + '.tep')
  await pipe(response.body, createWriteStream(filename))
  return filename
}
