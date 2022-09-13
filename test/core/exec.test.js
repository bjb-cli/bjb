const exec = require('../../lib/core/exec')

it('unit:core:exec:normal', async () => {
  await exec('node', ['--version'], { stdio: 'ignore' })
})

it('unit:core:exec:error', async () => {
  try {
    await exec('bjbbjbbjb', [], {})
  } catch (error) {
    expect(error.message).toBe('spawn bjbbjbbjb ENOENT')
  }
})

it('unit:core:exec:fail', async () => {
  try {
    await exec('node', ['-bjb'], {})
  } catch (error) {
    expect(error.message).toBe('Failed to execute node command.')
  }
})
