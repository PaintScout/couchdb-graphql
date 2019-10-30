import { createServer } from './index'

createServer({ dbUrl: process.env.DB_URL as string })
  .listen()
  .then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
