const fs = require('fs')
const http = require('../../lib/core/http')
const { destory } = require('../helpers')

const registry = 'https://registry.npmjs.org'
const tarball = `${registry}/color-name/-/color-name-1.1.4.tgz`

it('unit:core:http:request', async () => {
  const response = await http.request(registry)
  expect(response.ok).toBe(true)

  const data = await response.json()
  expect(data).toBeTruthy()
  expect(data.db_name).toBe('registry')
})

it('unit:core:http:request:error', async () => {
  expect.hasAssertions()
  try {
    await http.request(`${registry}/faaaaaaaaaker-${Date.now()}`)
  } catch (error) {
    expect(error.message).toBe('Unexpected response: Not Found')
  }
})

it('unit:core:http:download', async () => {
  const filename = await http.download(tarball)
  const stats = await fs.promises.stat(filename)
  expect(stats.isFile()).toBe(true)
  expect(stats.size).toBe(2868)
  await destory(filename)
})

it('unit:core:http:download:text', async () => {
  const filename = await http.download(registry)
  const stats = await fs.promises.stat(filename)
  expect(stats.isFile()).toBe(true)
  await destory(filename)
})

it('unit:core:http:download:error', async () => {
  expect.hasAssertions()
  try {
    await http.download(`${registry}/faaaaaaaaaker-${Date.now()}.tgz`)
  } catch (error) {
    expect(error.message).toBe('Unexpected response: Not Found')
  }
})
