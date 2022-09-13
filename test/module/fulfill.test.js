const chalk = require('chalk')
const { context } = require('../helpers')
const { fulfill } = require('../../lib/modules/fulfill')

let log = null

beforeEach(async () => {
  log = jest.spyOn(console, 'log').mockImplementation()
})

afterEach(async () => {
  log.mockRestore()
})

it('unit:fulfill:fallback', async () => {
  const ctx = context({
    template: 'fallback',
    project: 'fallback-app',
    files: [
      { path: 'foo.txt', contents: Buffer.from('') },
      { path: 'foo/bar.txt', contents: Buffer.from('') },
      { path: 'bar.txt', contents: Buffer.from('') }
    ]
  })
  await fulfill(ctx)
  expect(log.mock.calls[0][0]).toBe(chalk.green('Created a new project in `fallback-app` by the `fallback` template.\n'))
  expect(log.mock.calls[1][0]).toBe(chalk.blue('- bar.txt\n'))
  expect(log.mock.calls[2][0]).toBe(chalk.blue('- foo.txt\n'))
  expect(log.mock.calls[3][0]).toBe(chalk.blue('- foo/bar.txt\n'))
  expect(log.mock.calls[4][0]).toBe(chalk.green.bold('Happy hacking :)'))
})

it('unit:fulfill:string', async () => {
  const ctx = context({}, { fulfill: 'fulfilled' })
  await fulfill(ctx)
  expect(log.mock.calls[0][0]).toBe(chalk.green('fulfilled'))
})

it('unit:fulfill:callback', async () => {
  const callback = jest.fn()
  const ctx = context({}, { fulfill: callback })
  await fulfill(ctx)
  expect(callback.mock.calls[0][0]).toBe(ctx)
})

it('unit:fulfill:callback-return', async () => {
  const callback = jest.fn().mockReturnValue('fulfilled')
  const ctx = context({}, { fulfill: callback })
  await fulfill(ctx)
  expect(callback).toHaveBeenCalled()
  expect(log.mock.calls[0][0]).toBe(chalk.green('fulfilled'))
})

it('unit:fulfill:callback-promise', async () => {
  const callback = jest.fn().mockReturnValue(Promise.resolve('fulfilled'))
  const ctx = context({}, { fulfill: callback })
  await fulfill(ctx)
  expect(callback).toHaveBeenCalled()
  expect(log.mock.calls[0][0]).toBe(chalk.green('fulfilled'))
})
