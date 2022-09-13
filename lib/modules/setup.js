exports.setup = async (ctx) => {
  if (ctx.config.setup == null) return
  await ctx.config.setup(ctx)
}
