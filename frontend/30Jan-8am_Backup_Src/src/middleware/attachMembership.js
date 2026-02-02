const db = require("../db")

module.exports.attachMembership = async (req, res, next) => {
  const projectId = req.headers["x-project-id"]

  if (!projectId) {
    return res.status(400).json({ error: "Missing X-Project-Id header" })
  }

  const membership = await db.memberships.findOne({
    user_id: req.user.id,
    project_id: projectId
  })

  if (!membership) {
    return res.status(403).json({ error: "No access to project" })
  }

  req.user.projectId = projectId
  req.user.role = membership.role

  next()
}
