const path = require('path')
const prompts = require('prompts')
const { config } = require('../../lib/core')
const { context } = require('../helpers')
const { mutual, validater, processor } = require('../../lib/modules/mutual')

it('unit:mutual:validater:name', async () => {
  expect(validater.name('foo')).toBe(true)
  expect(validater.name('foo-bar')).toBe(true)
  expect(validater.name('foo_bar')).toBe(true)
  expect(validater.name('@foo/bar')).toBe(true)
  expect(validater.name('b j b')).toBe('name can only contain URL-friendly characters')
  expect(validater.name('BJB')).toBe('name can no longer contain capital letters')
  expect(validater.name('Bjb')).toBe('name can no longer contain capital letters')
})

it('unit:mutual:validater:version', async () => {
  expect(validater.version('0.1.0')).toBe(true)
  expect(validater.version('0.1')).toBe('The `0.1` is not a semantic version.')
  expect(validater.version('0')).toBe('The `0` is not a semantic version.')
})

it('unit:mutual:validater:email', async () => {
  expect(validater.email('w@bjb.me')).toBe(true)
  expect(validater.email('foo')).toBe('The `foo` is not a email address.')
  expect(validater.email('w@bjb')).toBe('The `w@bjb` is not a email address.')
})

it('unit:mutual:validater:url', async () => {
  expect(validater.url('http://bjb.me')).toBe(true)
  expect(validater.url('https://bjb.me')).toBe(true)
  expect(validater.url('foo')).toBe('The `foo` is not a url address.')
  expect(validater.url('ftp://bjb.me')).toBe('The `ftp://bjb.me` is not a url address.')
})

it('unit:mutual:processor:name', async () => {
  const ctx = context({ dest: __dirname })
  const fn = processor(ctx)

  const prompt1 = { name: 'name', type: 'text' }
  fn(prompt1)
  expect(prompt1.validate).toBe(validater.name)
  expect(prompt1.initial).toBe(path.basename(__dirname))

  const prompt2 = { name: 'name', type: 'text', initial: 'foo' }
  fn(prompt2)
  expect(prompt2.validate).toBe(validater.name)
  expect(prompt2.initial).toBe('foo')

  const validate3 = jest.fn()
  const prompt3 = { name: 'name', type: 'text', validate: validate3 }
  fn(prompt3)
  expect(prompt3.validate).toBe(validate3)
})

it('unit:mutual:processor:version', async () => {
  const ctx = context({})
  const fn = processor(ctx)

  const prompt0 = { name: 'version', type: 'text', initial: '3.2.1' }
  fn(prompt0)
  expect(prompt0.validate).toBe(validater.version)
  expect(prompt0.initial).toBe('3.2.1')

  const mockConfig = jest.spyOn(config, 'npm', 'get').mockReturnValue({ 'init-version': '1.2.3' })

  const prompt1 = { name: 'version', type: 'text' }
  fn(prompt1)
  expect(prompt1.initial).toBe('1.2.3')

  const validate2 = jest.fn()
  const prompt2 = { name: 'version', type: 'text', validate: validate2 }
  fn(prompt2)
  expect(prompt2.validate).toBe(validate2)

  jest.spyOn(config, 'npm', 'get').mockReturnValue({})
  const prompt3 = { name: 'version', type: 'text' }
  fn(prompt3)
  expect(prompt3.initial).toBe('0.1.0')

  jest.spyOn(config, 'npm', 'get').mockReturnValue(undefined)
  const prompt4 = { name: 'version', type: 'text' }
  fn(prompt4)
  expect(prompt4.initial).toBe('0.1.0')

  mockConfig.mockRestore()
})

it('unit:mutual:processor:author', async () => {
  const ctx = context({})
  const fn = processor(ctx)

  const prompt0 = { name: 'author', type: 'text', initial: 'bjb' }
  fn(prompt0)
  expect(prompt0.initial).toBe('bjb')

  const mockConfig = jest.spyOn(config, 'npm', 'get').mockReturnValue({ 'init-author-name': 'uzi-npm' })

  const prompt1 = { name: 'author', type: 'text' }
  fn(prompt1)
  expect(prompt1.initial).toBe('uzi-npm')

  jest.spyOn(config, 'npm', 'get').mockReturnValue({})
  jest.spyOn(config, 'git', 'get').mockReturnValue({ user: { name: 'uzi-git' } })
  const prompt2 = { name: 'author', type: 'text' }
  fn(prompt2)
  expect(prompt2.initial).toBe('uzi-git')

  jest.spyOn(config, 'npm', 'get').mockReturnValue(undefined)
  jest.spyOn(config, 'git', 'get').mockReturnValue({ user: { name: 'uzi-git' } })
  const prompt3 = { name: 'author', type: 'text' }
  fn(prompt3)
  expect(prompt3.initial).toBe('uzi-git')

  jest.spyOn(config, 'git', 'get').mockReturnValue({})
  const prompt4 = { name: 'author', type: 'text' }
  fn(prompt4)
  expect(prompt4.initial).toBe(undefined)

  jest.spyOn(config, 'git', 'get').mockReturnValue(undefined)
  const prompt5 = { name: 'author', type: 'text' }
  fn(prompt5)
  expect(prompt5.initial).toBe(undefined)

  mockConfig.mockRestore()
})

it('unit:mutual:processor:email', async () => {
  const ctx = context({})
  const fn = processor(ctx)

  const prompt0 = { name: 'email', type: 'text', initial: 'w@bjb.me' }
  fn(prompt0)
  expect(prompt0.initial).toBe('w@bjb.me')

  const mockConfig = jest.spyOn(config, 'npm', 'get').mockReturnValue({ 'init-author-email': 'npm@uzi.com' })

  const prompt1 = { name: 'email', type: 'text' }
  fn(prompt1)
  expect(prompt1.validate).toBe(validater.email)
  expect(prompt1.initial).toBe('npm@uzi.com')

  jest.spyOn(config, 'npm', 'get').mockReturnValue({})
  jest.spyOn(config, 'git', 'get').mockReturnValue({ user: { email: 'git@uzi.com' } })
  const prompt2 = { name: 'email', type: 'text' }
  fn(prompt2)
  expect(prompt2.initial).toBe('git@uzi.com')

  jest.spyOn(config, 'npm', 'get').mockReturnValue(undefined)
  jest.spyOn(config, 'git', 'get').mockReturnValue({ user: { email: 'git@uzi.com' } })
  const prompt3 = { name: 'email', type: 'text' }
  fn(prompt3)
  expect(prompt3.initial).toBe('git@uzi.com')

  jest.spyOn(config, 'git', 'get').mockReturnValue({})
  const prompt4 = { name: 'email', type: 'text' }
  fn(prompt4)
  expect(prompt4.initial).toBe(undefined)

  jest.spyOn(config, 'git', 'get').mockReturnValue(undefined)
  const prompt5 = { name: 'email', type: 'text' }
  fn(prompt5)
  expect(prompt5.initial).toBe(undefined)

  const validate6 = jest.fn()
  const prompt6 = { name: 'email', type: 'text', validate: validate6 }
  fn(prompt6)
  expect(prompt6.validate).toBe(validate6)

  mockConfig.mockRestore()
})

it('unit:mutual:processor:url', async () => {
  const ctx = context({})
  const fn = processor(ctx)

  const prompt0 = { name: 'url', type: 'text', initial: 'https://bjb.me' }
  fn(prompt0)
  expect(prompt0.initial).toBe('https://bjb.me')

  const mockConfig = jest.spyOn(config, 'npm', 'get').mockReturnValue({ 'init-author-url': 'https://npm.uzi.com' })

  const prompt1 = { name: 'url', type: 'text' }
  fn(prompt1)
  expect(prompt1.validate).toBe(validater.url)
  expect(prompt1.initial).toBe('https://npm.uzi.com')

  jest.spyOn(config, 'npm', 'get').mockReturnValue({})
  jest.spyOn(config, 'git', 'get').mockReturnValue({ user: { url: 'https://git.uzi.com' } })
  const prompt2 = { name: 'url', type: 'text' }
  fn(prompt2)
  expect(prompt2.initial).toBe('https://git.uzi.com')

  jest.spyOn(config, 'npm', 'get').mockReturnValue(undefined)
  jest.spyOn(config, 'git', 'get').mockReturnValue({ user: { url: 'https://git.uzi.com' } })
  const prompt3 = { name: 'url', type: 'text' }
  fn(prompt3)
  expect(prompt3.initial).toBe('https://git.uzi.com')

  jest.spyOn(config, 'git', 'get').mockReturnValue({})
  const prompt4 = { name: 'url', type: 'text' }
  fn(prompt4)
  expect(prompt4.initial).toBe(undefined)

  jest.spyOn(config, 'git', 'get').mockReturnValue(undefined)
  const prompt5 = { name: 'url', type: 'text' }
  fn(prompt5)
  expect(prompt5.initial).toBe(undefined)

  const validate6 = jest.fn()
  const prompt6 = { name: 'url', type: 'text', validate: validate6 }
  fn(prompt6)
  expect(prompt6.validate).toBe(validate6)

  mockConfig.mockRestore()
})

it('unit:mutual:default', async () => {
  const clear = jest.spyOn(console, 'clear').mockImplementation()
  const ctx = context({ dest: __dirname })
  prompts.inject(['foo'])
  await mutual(ctx)
  expect(clear).toBeCalledTimes(1)
  expect(ctx.config.prompts).toEqual([{ name: 'name', type: 'text', message: 'Project name', initial: path.basename(__dirname), validate: validater.name }])
  expect(ctx.answers).toEqual({ name: 'foo' })
  clear.mockRestore()
})

it('unit:mutual:custom', async () => {
  const clear = jest.spyOn(console, 'clear').mockImplementation()
  const ctx = context({}, {
    prompts: [
      { name: 'foo', type: 'text', message: 'foo' },
      { name: 'bar', type: 'text', message: 'bar' }
    ]
  })
  prompts.inject(['foo', 'bar'])
  await mutual(ctx)
  expect(clear).toBeCalledTimes(1)
  expect(ctx.answers).toEqual({ foo: 'foo', bar: 'bar' })
  clear.mockRestore()
})

it('unit:mutual:override', async () => {
  const clear = jest.spyOn(console, 'clear').mockImplementation()
  const ctx = context({}, {
    prompts: [
      { name: 'foo', type: 'text', message: 'foo' },
      { name: 'bar', type: 'text', message: 'bar' }
    ]
  })
  // options for override
  Object.assign(ctx.options, { foo: 'foo', bar: 'bar' })
  await mutual(ctx)
  expect(clear).toBeCalledTimes(1)
  expect(ctx.answers).toEqual({ foo: 'foo', bar: 'bar' })
  clear.mockRestore()
})
