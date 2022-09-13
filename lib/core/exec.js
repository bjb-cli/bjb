const { spawn } = require('child_process')

/**
 * 利用子进程执行命令
 * @param {String} command
 * @param {String} args
 * @param {SpawnOptions} options
 * @returns
 */
module.exports = (command, args, options) => new Promise((resolve, reject) => {
  const inS = spawn(command, args, options)
  inS.on('error', reject)
  inS.on('exit', code => {
    if (code === 0) return resolve()
    reject(new Error(`Failed to execute ${command} command.`))
  })
  // inS.stdout.on('data', (data) => {
  //   let dataStr = String(data)
  //   process.stdout.write('\n' + dataStr)
  // })
})
