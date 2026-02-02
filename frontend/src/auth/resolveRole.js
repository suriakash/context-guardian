const db = require("../db")

module.exports.resolveRole = async ({
  userId,
  projectRole,
  contextId
}) => {
  if (!contextId) {
    return projectRole
  }

  const override = await db.context_permissions.findOne({
    user_id: userId,
    context_id: contextId
  })

  return override ? override.role : projectRole
}
