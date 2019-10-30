import { createServer } from './index'

createServer({
  dbUrl: process.env.DB_URL as string,
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
