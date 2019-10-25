import { createServer } from './index'

createServer()
  .listen()
  .then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`)
  })
