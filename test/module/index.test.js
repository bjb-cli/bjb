const modules = require('../../lib/modules')

it('unit:modules', async () => {
  expect(typeof modules.ready).toBe('function')
  expect(typeof modules.resolve).toBe('function')
  expect(typeof modules.rely).toBe('function')
  expect(typeof modules.mutual).toBe('function')
  expect(typeof modules.setup).toBe('function')
  expect(typeof modules.beforeRender).toBe('function')
  expect(typeof modules.render).toBe('function')
  expect(typeof modules.afterRender).toBe('function')
  expect(typeof modules.install).toBe('function')
  expect(typeof modules.init).toBe('function')
  expect(typeof modules.fulfill).toBe('function')
})