const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const { file, http, config } = require('../../lib/core')
const { context, exists, destory, fixture, mktmpdir } = require('../helpers')
const { resolve, getTemplatePath, getTemplateUrl } = require('../../lib/modules/resolve')

let log = null
let download = null
let temdir

const src = path.join(config.paths.cache, '486102eedf8caffa')

beforeEach(async () => {
  log = jest.spyOn(console, 'log').mockImplementation()
  download = jest.spyOn(http, 'download').mockImplementation(async () => {
    temdir = await mktmpdir()
    const source = fixture('archive.zip')
    const target = path.join(temdir, 'archive.zip')
    await fs.promises.copyFile(source, target)
    return target
  })
})

afterEach(async () => {
  log.mockRestore()
  download.mockRestore()
  if (temdir) {
    await destory(temdir)
    temdir = undefined
  }
})

it('unit:resolve:getTemplatePath', async () => {
  const notdir = await getTemplatePath('notdir')
  expect(notdir).toBe(false)

  const existDir = await getTemplatePath(__dirname)
  expect(existDir).toBe(__dirname)

  try {
    await getTemplatePath('./test-path')
  } catch (error) {
    expect(error.message).toBe('Local template not found: `./test-path` is not a directory')
  }

  try {
    await getTemplatePath('~/test-path')
  } catch (error) {
    expect(error.message).toBe('Local template not found: `~/test-path` is not a directory')
  }
})

it('unit:resolve:getTemplateUrl', async () => {
  const url1 = await getTemplateUrl('tpl1')
  expect(url1).toBe('https://github.com/bjb-cli/tpl1/archive/refs/heads/master.zip')

  const url2 = await getTemplateUrl('bjb/tpl2')
  expect(url2).toBe('https://github.com/bjb/tpl2/archive/refs/heads/master.zip')

  const url3 = await getTemplateUrl('bjb/tpl3#dev')
  expect(url3).toBe('https://github.com/bjb/tpl3/archive/refs/heads/dev.zip')

  const url4 = await getTemplateUrl('tpl4#dev')
  expect(url4).toBe('https://github.com/bjb-cli/tpl4/archive/refs/heads/dev.zip')

  const url5 = await getTemplateUrl('https://github.com/bjb/tpl5/archive/refs/heads/dev.zip')
  expect(url5).toBe('https://github.com/bjb/tpl5/archive/refs/heads/dev.zip')

  const url6 = await getTemplateUrl('bjb/tpl3#dev/cli')
  expect(url6).toBe('https://github.com/bjb/tpl3/archive/refs/heads/dev/cli.zip')

  const url7 = await getTemplateUrl('tpl7#topic/xyz')
  expect(url7).toBe('https://github.com/bjb-cli/tpl7/archive/refs/heads/topic/xyz.zip')
})

it('unit:resolve:local-relative', async () => {
  const ctx = context({
    template: './test-path'
  })
  try {
    await resolve(ctx)
  } catch (error) {
    expect(error.message).toBe('Local template not found: `./test-path` is not a directory')
  }
})

test('unit:resolve:local-absolute', async () => {
  const ctx = context({
    template: __dirname
  })
  await resolve(ctx)
  expect(ctx.src).toBe(__dirname)
})

it('unit:resolve:local-tildify', async () => {
  const ctx = context({
    template: '~/test-path'
  })
  try {
    await resolve(ctx)
  } catch (error) {
    expect(error.message).toBe('Local template not found: `~/test-path` is not a directory')
  }
})

it('unit:resolve:fetch-remote', async () => {
  await fs.promises.mkdir(src, { recursive: true })

  const ctx = context({
    template: 'minima'
  })
  await resolve(ctx)
  expect(ctx.src).toBe(src)
  expect(await exists(src)).toBe(true)
  expect(await exists(path.join(src, 'LICENSE'))).toBe(true)
  expect(await exists(path.join(src, 'README.md'))).toBe(true)
})

it('unit:resolve:fetch-cache-success', async () => {
  await fs.promises.mkdir(src, { recursive: true })

  const ctx = context({
    template: 'minima',
    options: {
      offline: true
    }
  })
  await resolve(ctx)
  expect(log.mock.calls[0][0]).toBe(chalk.green(`Using cached template: \`${file.tildify(src)}\`.`))
})

it('unit:resolve:fetch-cache-failed', async () => {
  await destory(src)

  const ctx = context({ template: 'minima', options: { offline: true } })
  await resolve(ctx)
  expect(log.mock.calls[0][0]).toBe(chalk.redBright(`Cache not found: \`${file.tildify(src)}\`.`))
  expect(ctx.src).toBe(src)
  expect(await exists(src)).toBe(true)
  expect(await exists(path.join(src, 'LICENSE'))).toBe(true)
  expect(await exists(path.join(src, 'README.md'))).toBe(true)
})

it('unit:resolve:fetch-error', async () => {
  download.mockImplementation(async () => {
    throw new Error('download error')
  })

  const ctx = context({ template: 'not-found' })
  expect.hasAssertions()
  try {
    await resolve(ctx)
  } catch (error) {
    expect(error.message).toBe('Failed to pull `not-found` template: download error.')
  }
})
