declare namespace NodeJS {
  interface ProcessEnv {
    PS_DB_ADMIN_URL: string
    [key: string]: string | undefined
  }
}
