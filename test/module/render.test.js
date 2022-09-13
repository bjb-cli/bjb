const fs = require('fs')
const { context, fixture } = require('../helpers')
const { render } = require('../../lib/modules/render')

it('unit:render:normal', async () => {
  const template = `
    <%= title %><% if (enable) { %>
    hahaha
    <% } %>
  `
  // binary files
  const zip = fs.readFileSync(fixture('archive.zip'))

  const ctx = context({
    answers: {
      title: 'bjb test',
      enable: false
    },
    files: [
      { path: 'a.txt', contents: Buffer.from(template) },
      { path: 'b.txt', contents: Buffer.from('bar') },
      { path: 'archive.zip', contents: zip }
    ]
  })

  await render(ctx)

  expect(ctx.files[0].contents.toString()).toBe(`
    bjb test
  `)
  expect(ctx.files[1].contents.toString()).toBe('bar')
  expect(ctx.files[2].contents).toBe(zip)
})

it('unit:render:metadata', async () => {
  const now = Date.now()

  const ctx = context({
    files: [
      { path: 'a.txt', contents: Buffer.from('<%= now %>') }
    ]
  }, {
    metadata: { now }
  })

  await render(ctx)

  expect(ctx.files[0].contents.toString()).toBe(now.toString())
})

it('unit:render:helpers', async () => {
  const ctx = context({
    files: [
      { path: 'a.txt', contents: Buffer.from('<%= upper(\'bjb\') %>') }
    ]
  }, {
    helpers: {
      upper: (i) => i.toUpperCase()
    }
  })

  await render(ctx)

  expect(ctx.files[0].contents.toString()).toBe('BJB')
})
