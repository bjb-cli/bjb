const fetch = require('../../lib/list/fetch')

it('unit:fetch:empty', async () => {
  const results = await fetch('ghost')
  expect(results).toEqual([])
})

it('unit:fetch:list', async () => {
  const results = await fetch('bjb-cli')
  expect(results.length).toBeTruthy()
})

it('unit:fetch:error', async () => {
  expect.hasAssertions()
  try {
    await fetch('fakkkkkkkkkkker')
  } catch (error) {
    expect(error.message).toBe('Failed to fetch list from remote: Unexpected response: Not Found.')
  }
})
