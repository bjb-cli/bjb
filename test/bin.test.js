const mockedInit = jest.fn().mockImplementation()
const mockedList = jest.fn().mockImplementation()

const mockArgv = (...args) => {
  const original = process.argv
  process.argv = original.slice(0, 2).concat(...args)
  return () => { process.argv = original }
}

beforeEach(async () => {
  jest.resetAllMocks()
  jest.resetModules()
  jest.mock('../', () => ({ main: mockedInit, list: mockedList }))
  jest.mock('../package.json', () => ({ name: 'bjb', version: '1.0.0' }))
})

afterAll(async () => {
  jest.clearAllMocks()
})

it('unit:bin:init', async () => {
  const restore = mockArgv('template', 'project', '--force', '--offline', '--foo', 'bar')
  require('../lib/bin')
  expect(mockedInit).toHaveBeenCalled()
  expect(mockedInit.mock.calls[0][0]).toBe('template')
  expect(mockedInit.mock.calls[0][1]).toBe('project')
  expect(mockedInit.mock.calls[0][2]).toEqual({ '--': [], f: true, force: true, o: true, offline: true, foo: 'bar' })
  restore()
})

it('unit:bin:list', async () => {
  const restore = mockArgv('list', 'bjb-cli', '--json', '--short')
  require('../lib/bin')
  expect(mockedList).toHaveBeenCalled()
  expect(mockedList.mock.calls[0][0]).toBe('bjb-cli')
  expect(mockedList.mock.calls[0][1]).toEqual({ '--': [], j: true, json: true, s: true, short: true })
  restore()
})

it('unit:bin:help', async () => {
  const restore = mockArgv('--help')
  const log = jest.spyOn(console, 'log').mockImplementation()
  require('../lib/bin')
  expect(log).toHaveBeenCalledTimes(1)
  expect(log.mock.calls[0][0]).toContain('$ bjb <template> [project]')
  log.mockRestore()
  restore()
})
