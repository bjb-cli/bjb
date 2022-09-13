const fs = require('fs')
const path = require('path')
const { context, destory, mktmpdir } = require('../helpers')
const { afterRender } = require('../../lib/modules/after-render')

it('unit:after-render:normal', async () => {
  const temp = await mktmpdir()
  const ctx = context({
    dest: temp,
    files: [
      { path: 'hello.txt', contents: Buffer.from('hello') },
      { path: 'foo/bar.txt', contents: Buffer.from('bar') }
    ]
  })
  await afterRender(ctx)
  const hello = await fs.promises.readFile(path.join(temp, 'hello.txt'), 'utf8')
  expect(hello).toBe('hello')
  const bar = await fs.promises.readFile(path.join(temp, 'foo/bar.txt'), 'utf8')
  expect(bar).toBe('bar')
  await destory(temp)
})

it('unit:after-render:hook', async () => {
  const callback = jest.fn()
  const ctx = context({}, { afterRender: callback })
  await afterRender(ctx)
  expect(callback.mock.calls[0][0]).toBe(ctx)
})
