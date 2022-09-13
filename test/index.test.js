const fs = require('fs')
const path = require('path')
const { http } = require('../lib/core')
const { destory, exists, fixture, mktmpdir } = require('./helpers')
const bjb = require('../')

it('unit:exports', async () => {
  expect(typeof bjb.file).toBe('object')
  expect(typeof bjb.http).toBe('object')
  expect(typeof bjb.config).toBe('object')
  expect(typeof bjb.exec).toBe('function')
  expect(typeof bjb.Bun).toBe('function')
  expect(typeof bjb.list).toBe('function')
  expect(typeof bjb.main).toBe('function')
})

it('unit:main', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation()
  const clear = jest.spyOn(console, 'clear').mockImplementation()
  const templateTmpDir = await mktmpdir()
  const download = jest.spyOn(http, 'download').mockImplementation(async () => {
    const source = fixture('minima.zip')
    const target = path.join(templateTmpDir, 'minima.zip')
    await fs.promises.copyFile(source, target)
    return target
  })

  const template = await mktmpdir()
  const original = process.cwd()
  process.chdir(template)
  await bjb.main('minma', 'minima-app', { force: true, offline: false, name: 'bjb' })
  expect(await exists('minima-app')).toBe(true)
  const contents = await fs.promises.readFile('minima-app/bjb.txt', 'utf-8')
  expect(contents.trim()).toBe('hey bjb.')
  process.chdir(original)
  expect(download).toHaveBeenCalled()
  expect(clear).toHaveBeenCalled()
  expect(log).toHaveBeenCalled()
  download.mockRestore()
  clear.mockRestore()
  log.mockRestore()
  await destory(template, templateTmpDir)
})

it('unit:error', async () => {
  expect.assertions(2)
  try {
    await bjb.main(null)
  } catch (error) {
    expect(error.message).toBe('Missing required argument: `template`.')
  }
  try {
    await bjb.main('')
  } catch (error) {
    expect(error.message).toBe('Missing required argument: `template`.')
  }
})
