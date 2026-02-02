const { resolveRole } = require("../auth/resolveRole")

module.exports.attachContextRole = async (req, res, next) => {
  const contextId =
    req.params.contextId ||
    req.body.contextId ||
    req.query.contextId

  const effectiveRole = await resolveRole({
    userId: req.user.id,
    projectRole: req.user.role,
    contextId
  })

  req.user.contextRole = effectiveRole

  next()
}
