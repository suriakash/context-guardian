const { PERMISSIONS } = require("../auth/permissions")

module.exports.requirePermission = (permission) => {
  return (req, res, next) => {
    const role = req.user.contextRole || req.user.role

    if (!role) {
      return res.status(401).json({ error: "Unauthenticated" })
    }

    const allowed = PERMISSIONS[role] || []

    const hasAccess = allowed.some(p => {
      if (p === permission) return true
      if (p.endsWith(":*")) {
        return permission.startsWith(p.split(":")[0])
      }
      return false
    })

    if (!hasAccess) {
      return res.status(403).json({ error: "Forbidden" })
    }

    next()
  }
}
