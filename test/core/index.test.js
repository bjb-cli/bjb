const core = require('../../lib/core')

it('unit:core', async () => {
  expect(typeof core.file).toBe('object')
  expect(typeof core.http).toBe('object')
  expect(typeof core.config).toBe('object')
  expect(typeof core.exec).toBe('function')
  expect(typeof core.Bun).toBe('function')
})
