const fs = require('fs')
const path = require('path')
const { context, destory, exists, mktmpdir } = require('../helpers')
const { init } = require('../../lib/modules/init')

it('unit:init:null', async () => {
  const ctx = context()
  const result = await init(ctx)
  expect(result).toBe(undefined)
})

it('unit:init:false', async () => {
  const ctx = context({}, { init: false })
  const result = await init(ctx)
  expect(result).toBe(undefined)
})

it('unit:init:default', async () => {
  const temp = await mktmpdir()
  await fs.promises.writeFile(path.join(temp, 'bjb.txt'), 'hello')
  const ctx = context({
    dest: temp,
    files: [{ path: '.gitignore', contents: Buffer.from('') }]
  }, { init: true })
  await init(ctx)
  expect(await exists(path.join(temp, '.git'))).toBe(true)
  const stats = await fs.promises.stat(path.join(temp, '.git'))
  expect(stats.isDirectory()).toBe(true)
  expect(await exists(path.join(temp, '.git', 'COMMIT_EDITMSG'))).toBe(true)
  const msg = await fs.promises.readFile(path.join(temp, '.git', 'COMMIT_EDITMSG'), 'utf8')
  expect(msg.trim()).toBe('feat: initial commit')
  await destory(temp)
})

it('unit:init:error', async () => {
  const temp = await mktmpdir()
  const ctx = context({ dest: temp }, { init: true })
  expect.hasAssertions()
  try {
    await init(ctx)
  } catch (error) {
    expect(error.message).toBe('Initial repository failed.')
  }
  await destory(temp)
})
