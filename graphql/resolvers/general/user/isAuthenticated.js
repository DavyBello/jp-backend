// isAuthenticated resolver for user
module.exports = {
  kind: 'query',
  name: 'isAuthenticated',
  description: 'returns true if user is authenticated',
  type: 'Boolean',
  resolve: () => true
}
