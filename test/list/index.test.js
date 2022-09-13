const chalk = require('chalk')
const { list } = require('../../lib/list')

it('unit:list:default', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation()
  await list()
  expect(log.mock.calls[0][0]).toBe(chalk.green('Available official\'s templates:'))
  log.mockRestore()
})

it('unit:list:owner', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation()
  await list('bjb-cli')
  expect(log.mock.calls[0][0]).toBe(chalk.green('Available official\'s templates:'))
  log.mockRestore()
})

it('unit:list:short', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation()
  await list(undefined, { short: true })
  expect(log.mock.calls[0][0]).toMatch(/→\s.+/)
  log.mockRestore()
})

it('unit:list:short-owner', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation()
  await list('bjb-cli', { short: true })
  expect(log.mock.calls[0][0]).toMatch(/→\s.+/)
  log.mockRestore()
})

it('unit:list:empty', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation()
  await list('ghost')
  expect(log.mock.calls[0][0]).toBe(chalk.redBright('No available templates.'))
  log.mockRestore()
})
