const os = require('os')
const fs = require('fs')
const path = require('path')
const AdmZip = require('adm-zip')

/**
 * 根据提供的路径检测是否存在
 * @param {String} input
 */
exports.exists = async (input) => {
  try {
    const stat = await fs.promises.stat(input)
    if (stat.isDirectory()) {
      return 'dir'
    } else if (stat.isFile()) {
      return 'file'
    } else {
      return 'other'
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error
    }
    return false
  }
}

/**
 * 检测是否是文件
 * @param {String} input
 * @returns Boolean
 */
exports.isFile = async (input) => {
  const result = await this.exists(input)
  return result === 'file'
}

/**
 * 检测是否是文件夹
 * @param {String} input
 * @returns Boolean
 */
exports.isDirectory = async (input) => {
  const result = await this.exists(input)
  return result === 'dir'
}

/**
 * 检测文件夹是否为空
 * @param {String} input
 * @returns Boolean
 */
exports.isEmpty = async (input) => {
  const files = await fs.promises.readdir(input)
  return files.length === 0
}

/**
 * 创建文件夹（可以创建父目录）
 * require node >= v10.12
 * @param {String} input
 * @param {Object} options
 */
exports.mkdir = async (input, options = {}) => {
  await fs.promises.mkdir(input, { recursive: true, ...options })
}

/**
 * 删除文件及文件夹，如果是文件夹支持递归删除
 * require node >= v14.14.0
 * @param {String} input
 * @param {Object} options
 */
exports.remove = async (input, options) => {
  await fs.promises.rm(input, { recursive: true, force: true, ...options })
}

/**
 * 读取文件
 * @param {String} input
 * @returns Promise
 */
exports.read = async (input) => {
  return await fs.promises.readFile(input)
}

/**
 * 创建文件并写入文件
 * @param {String} input
 * @param {String} contents
 * @returns
 */
exports.write = async (input, contents) => {
  await this.mkdir(path.dirname(input))
  return await fs.promises.writeFile(input, contents)
}

/**
 * 检测buffer是否是二进制
 * @param {Uint8Array} input
 * @returns boolean
 */
exports.isBinary = (input) => {
  // 检测编码
  // 65533是未知字符
  // 8及以下是控制字符，例如空格，null，eof
  return input.some(item => item === 65533 || item <= 8)
}

/**
 * 提取相对路径
 * @param {String} input
 * @returns string
 * @see https://github.com/sindresorhus/tildify
 */
exports.tildify = (input) => {
  // C:\Users\surface
  const home = os.homedir()

  // https://github.com/sindresorhus/tildify/issues/3
  input = path.normalize(input) + path.sep

  if (input.indexOf(home) === 0) {
    input = input.replace(home + path.sep, `~${path.sep}`)
  }
  return input.slice(0, -1)
}

/**
 * 去除~字符
 * @param {String} input
 * @returns string
 * @see https://github.com/sindresorhus/untildify
 */
exports.untildify = (input) => {
  const home = os.homedir()

  input = input.replace(/^~(?=$|\/|\\)/, home)

  return path.normalize(input)
}

exports.extract = async (input, output, strip = 0) => await new Promise(resolve => {
  const zip = new AdmZip(input)

  strip === 0 || zip.getEntries().forEach(entry => {
    const items = entry.entryName.split(/\/|\\/)
    const start = Math.min(strip, items.length - 1)
    const stripped = items.slice(start).join('/')
    entry.entryName = stripped === '' ? entry.entryName : stripped
  })

  // https://github.com/cthackers/adm-zip/issues/389
  // https://github.com/cthackers/adm-zip/issues/407#issuecomment-990086783
  // keep original file permissions
  zip.extractAllToAsync(output, true, true, err => {
    /* istanbul ignore if */
    if (err != null) throw err
    resolve()
  })
})
