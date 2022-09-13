module.exports = class Bun {
  middleBuns = []

  use (middleBun) {
    this.middleBuns.push(middleBun)
  }

  run (context) {
    return this.middleBuns.reduce(
      (prev, current) => prev.then(() => current(context)),
      Promise.resolve()
    )
  }
}
