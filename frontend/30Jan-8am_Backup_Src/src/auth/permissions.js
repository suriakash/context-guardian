module.exports.PERMISSIONS = {
  owner: [
    "project:*",
    "context:*",
    "user:*",
    "audit:*"
  ],
  admin: [
    "project:read",
    "context:*",
    "user:invite",
    "user:remove"
  ],
  editor: [
    "project:read",
    "context:create",
    "context:update",
    "context:read"
  ],
  viewer: [
    "project:read",
    "context:read"
  ]
}
