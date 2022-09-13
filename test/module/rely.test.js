const fs = require('fs')
const path = require('path')
const { context, exists, destory, fixture, mktmpdir } = require('../helpers')
const { rely } = require('../../lib/modules/rely')

it('unit:rely:normal', async () => {
  const ctx = context({
    src: fixture('features')
  })
  await rely(ctx)
  expect(ctx.config.name).toBe('features')
  expect(ctx.config.version).toBe('0.1.0')
  expect(ctx.config.source).toBe('template')
  expect(ctx.config.metadata?.date).toBeTruthy()
  expect(ctx.config.prompts).toBeInstanceOf(Array)
  expect(ctx.config.filters).toBeTruthy()
  expect(ctx.config.helpers).toBeTruthy()
  expect(ctx.config.install).toBe('npm')
  expect(ctx.config.init).toBe(true)
  expect(typeof ctx.config.setup).toBe('function')
  expect(typeof ctx.config.prepare).toBe('function')
  expect(typeof ctx.config.emit).toBe('function')
  expect(typeof ctx.config.complete).toBe('function')
})

it('unit:rely:default', async () => {
  const ctx = context({ template: 'test-rely', src: fixture('minima') })
  await rely(ctx)
  expect(ctx.config.name).toBe('test-rely')
})

it('unit:rely:error', async () => {
  const ctx = context({ src: fixture('error') })
  expect.hasAssertions()
  try {
    await rely(ctx)
  } catch (error) {
    expect(error.message).toBe('Invalid template: template needs to expose an object.')
  }
})

it('unit:rely:install-deps', async () => {
  const temp = await mktmpdir()

  await fs.promises.writeFile(path.join(temp, 'package.json'), JSON.stringify({
    dependencies: { 'color-name': '1.1.4' },
    devDependencies: { 'color-convert': '2.0.1' },
    main: 'index.js'
  }))
  await fs.promises.writeFile(path.join(temp, 'index.js'), 'module.exports = {}')

  const ctx = context({ src: temp })

  await rely(ctx)

  expect(await exists(path.join(ctx.src, 'node_modules'))).toBe(true)
  expect(await exists(path.join(ctx.src, 'node_modules/color-name'))).toBe(true)
  expect(await exists(path.join(ctx.src, 'node_modules/color-convert'))).toBe(false)

  await destory(temp)
})
