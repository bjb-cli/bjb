const fs = require('fs')
const path = require('path')
const prompts = require('prompts')
const { context, destory, mktmpdir } = require('../helpers')
const { ready } = require('../../lib/modules/ready')

const cwd = process.cwd()

beforeAll(async () => {
  process.chdir(await mktmpdir())
})

afterAll(async () => {
  const temp = process.cwd()
  process.chdir(cwd)
  await destory(temp)
})

it('unit:ready:not-exists', async () => {
  const ctx = context({
    project: 'not-exists'
  })
  await ready(ctx)
  expect(ctx.dest).toBe(path.resolve('not-exists'))
})

it('unit:ready:file', async () => {
  await fs.promises.writeFile('file', '')
  const ctx = context({
    project: 'file'
  })
  expect.hasAssertions()
  try {
    await ready(ctx)
  } catch (error) {
    expect(error.message).toBe('Cannot create file: it is a file and exists.')
  }
})

it('unit:ready:empty', async () => {
  await fs.promises.mkdir('empty')
  const ctx = context({
    project: 'empty'
  })
  await ready(ctx)
  expect(ctx.dest).toBe(path.resolve('empty'))
})

it('unit:ready:force', async () => {
  await fs.promises.mkdir('force')
  await fs.promises.writeFile('force/test.js', 'test')
  const ctx = context({
    project: 'force',
    options: {
      force: true
    }
  })
  await ready(ctx)
  expect(ctx.dest).toBe(path.resolve('force'))
})

it('unit:ready:sure', async () => {
  await fs.promises.mkdir('sure')
  await fs.promises.writeFile('sure/test', '')
  prompts.inject([false])
  const ctx = context({
    project: 'sure'
  })
  expect.hasAssertions()
  try {
    await ready(ctx)
  } catch (error) {
    expect(error.message).toBe('You have cancelled this task.')
  }
})

it('unit:ready:merge', async () => {
  await fs.promises.mkdir('merge')
  await fs.promises.writeFile('merge/test', '')
  prompts.inject([true, 'merge'])
  const ctx = context({
    project: 'merge'
  })
  await ready(ctx)
  expect(ctx.dest).toBe(path.resolve('merge'))
  expect(fs.existsSync('merge/test')).toBe(true)
})

it('unit:ready:overwrite', async () => {
  await fs.promises.mkdir('overwrite')
  await fs.promises.writeFile('overwrite/test', '')
  prompts.inject([true, 'overwrite'])
  const ctx = context({
    project: 'overwrite'
  })
  await ready(ctx)
  expect(ctx.dest).toBe(path.resolve('overwrite'))
  expect(fs.existsSync('overwrite')).toBe(false)
})

it('unit:ready:cancel', async () => {
  await fs.promises.mkdir('cancel')
  await fs.promises.writeFile('cancel/test', '')
  prompts.inject([true, 'cancel'])
  const ctx = context({
    project: 'cancel'
  })
  expect.hasAssertions()
  try {
    await ready(ctx)
  } catch (error) {
    expect(error.message).toBe('You have cancelled this task.')
    expect(fs.existsSync('cancel/test')).toBe(true)
  }
})
