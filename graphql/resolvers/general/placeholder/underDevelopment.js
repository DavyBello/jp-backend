// isAuthenticated resolver for user
module.exports = {
  kind: 'query',
  name: 'underDevelopment',
  description: 'returns msg about api endpoint',
  type: 'String',
  resolve: () => ' 🙂 This api endpoint is currenty under development 🙂'
}
