require('dotenv').config()

import { createServer } from './src/index'

createServer({
  dbUrl: process.env.DB_URL,
  setContext: ({ req }) => {
    return {
      dbName: req.headers.db,
    }
  },
})
  .listen()
  .then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
