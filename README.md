# Cloudant GraphQL Server

proof of concept for a Cloudant GraphQL server

# Development

- create a copy of `.env-sample` as `.env` and fill in the appropriate values

- run

  ```cli
  yarn start
  ```

- open up the GraphiQL editor at http://localhost:4000

- set the `HTTP HEADERS` at the bottom to

  ```json
  {
    "db": "your-database-name"
  }
  ```

- now you can make requests in the GraphiQL editor

# API coverage

- [x] get
- [x] info
- [x] put
- [ ] bulkDocs
- [ ] bulkGet
- [ ] changes
- [ ] search
- [ ] find
- [ ] query
