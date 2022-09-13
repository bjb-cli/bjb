const { Bun, file, config, http, exec } = require('./core')
const {
  ready,
  resolve,
  rely,
  mutual,
  setup,
  beforeRender,
  render,
  afterRender,
  install,
  init,
  fulfill
} = require('./modules')
const { list } = require('./list')

const buner = new Bun()
buner.use(ready)
buner.use(resolve)
buner.use(rely)
buner.use(mutual)
buner.use(setup)
buner.use(beforeRender)
buner.use(render)
buner.use(afterRender)
buner.use(install)
buner.use(init)
buner.use(fulfill)

exports.main = async (template, project, options) => {
  if (template == null || template === '') {
    throw new Error('Missing required argument: `template`.')
  }

  // context
  const context = {
    template,
    project,
    options,
    src: '',
    dest: '',
    config: Object.create(null),
    answers: Object.create(null),
    files: []
  }

  // running pipeor
  await buner.run(context)
}

exports.list = list

exports.Bun = Bun
exports.file = file
exports.config = config
exports.http = http
exports.exec = exec
