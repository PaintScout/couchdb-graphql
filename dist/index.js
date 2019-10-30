
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./couchdb-graphql.cjs.production.min.js')
} else {
  module.exports = require('./couchdb-graphql.cjs.development.js')
}
