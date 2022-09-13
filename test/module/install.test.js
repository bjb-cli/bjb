const fs = require('fs')
const path = require('path')
const { context, destory, exists, mktmpdir } = require('../helpers')
const { install } = require('../../lib/modules/install')

it('unit:install:false', async () => {
  const ctx = context({}, { install: false })
  const result = await install(ctx)
  expect(result).toBe(undefined)
})

it('unit:install:null', async () => {
  const ctx = context()
  const result = await install(ctx)
  expect(result).toBe(undefined)
})

it('unit:install:default', async () => {
  const temp = await mktmpdir()
  const pkg = { dependencies: { 'color-name': '1.1.4' } }
  await fs.promises.writeFile(path.join(temp, 'package.json'), JSON.stringify(pkg))
  const ctx = context({
    dest: temp,
    files: [{ path: 'package.json', contents: Buffer.from('') }]
  })
  await install(ctx)
  expect(ctx.config.install).toBe('npm')
  expect(await exists(path.join(temp, 'node_modules'))).toBe(true)
  expect(await exists(path.join(temp, 'node_modules', 'color-name'))).toBe(true)
  expect(await exists(path.join(temp, 'node_modules', 'color-name', 'package.json'))).toBe(true)
  await destory(temp)
})

// required yarn env
it('unit:install:manual:yarn', async () => {
  const temp = await mktmpdir()
  const pkg = { dependencies: { 'color-name': '1.1.4' } }
  await fs.promises.writeFile(path.join(temp, 'package.json'), JSON.stringify(pkg))
  const ctx = context({ dest: temp }, { install: 'yarn' })
  await install(ctx)
  expect(await exists(path.join(temp, 'yarn.lock'))).toBe(true)
  expect(await exists(path.join(temp, 'node_modules'))).toBe(true)
  expect(await exists(path.join(temp, 'node_modules', 'color-name'))).toBe(true)
  expect(await exists(path.join(temp, 'node_modules', 'color-name', 'package.json'))).toBe(true)
  await destory(temp)
})

it('unit:install:manual:error', async () => {
  const temp = await mktmpdir()
  await fs.promises.writeFile(path.join(temp, 'package.json'), 'error package.json')
  const ctx = context({ dest: temp }, { install: 'npm' })
  expect.hasAssertions()
  try {
    await install(ctx)
  } catch (error) {
    expect(error.message).toBe('Install dependencies failed.')
  }
  await destory(temp)
})
