const ora = require('ora')
const { http, config } = require('../core')

module.exports = async (owner) => {
  const spinner = ora('Loading available list from remote...').start()

  const data = {
    owner
  }
  try {
    const url = config.list.replace(/{(\w+)}/g, (_, key) => data[key])
    const response = await http.request(url)
    const results = await response.json()
    spinner.stop()
    return results
  } catch (error) {
    spinner.stop()
    throw new Error(`Failed to fetch list from remote: ${error.message}.`)
  }
}
