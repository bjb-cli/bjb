const { context, fixture } = require('../helpers')
const { beforeRender } = require('../../lib/modules/before-render')

const src = fixture('features')

it('unit:before-render:default', async () => {
  const ctx = context({
    src,
    answers: {
      name: 'bjb'
    }
  })
  await beforeRender(ctx)
  expect(ctx.files).toHaveLength(5)
  const names = ctx.files.map(i => i.path)
  expect(names).toContain('README.md')
  expect(names).toContain('package.json')
  expect(names).toContain('bin/bjb.js')
  expect(names).toContain('lib/index.js')
  expect(names).toContain('src/index.ts')
})

it('unit:before-render:custom', async () => {
  const ctx = context({
    src,
    answers: {
      features: ['cli', 'typescript'],
      name: 'bjb'
    }
  }, {
    filters: {
      'bin/**': a => (a.features).includes('cli'),
      'src/**': a => (a.features).includes('typescript'),
      'lib/**': a => !(a.features).includes('typescript')
    }
  })
  await beforeRender(ctx)
  expect(ctx.files).toHaveLength(4)
  const names = ctx.files.map(i => i.path)
  expect(names).toContain('README.md')
  expect(names).toContain('package.json')
  expect(names).toContain('bin/bjb.js')
  expect(names).toContain('src/index.ts')
})

it('unit:before-render:hook', async () => {
  const callback = jest.fn()
  const ctx = context({}, { beforeRender: callback })
  await beforeRender(ctx)
  expect(callback.mock.calls[0][0]).toBe(ctx)
})
