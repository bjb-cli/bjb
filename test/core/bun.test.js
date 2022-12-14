const Bun = require('../../lib/core/bun')

it('unit:core:bun', async () => {
  const order = []

  const app = new Bun()

  app.use(async state => {
    expect(state.a).toBe(1)
    state.b = 2
    order.push(1)
  })

  app.use(async state => {
    expect(state.b).toBe(2)
    order.push(2)
    // break chain
    throw new Error('break')
  })

  app.use(async () => {
    // never call
    order.push(3)
  })

  try {
    await app.run({ a: 1 })
  } catch (error) {
    expect(error.message).toEqual('break')
  }

  expect(order).toEqual([1, 2])
})
