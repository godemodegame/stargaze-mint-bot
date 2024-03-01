declare global {
  namespace NodeJS {
    interface ProcessEnv {
      BOT_TOKEN: string;
      MONGO_URL: string;
      MONGO_DB_NAME: string;
      SERVER_PORT: number;
      WEBAPP_URL: string;
    }
  }
}