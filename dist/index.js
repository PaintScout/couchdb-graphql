
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cloudant-graphql-server.cjs.production.min.js')
} else {
  module.exports = require('./cloudant-graphql-server.cjs.development.js')
}
