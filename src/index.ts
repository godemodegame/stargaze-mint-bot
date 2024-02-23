import mongoose from "mongoose";

import setupBot from "./bot";
import startApp from "./app";


mongoose
  .connect(
    process.env.MONGO_URL, 
    { 
      dbName: process.env.MONGO_DB_NAME,
      autoCreate: true,
    }
  ).then((client) => {
    startApp();
    startBot(client.connection.db);
  }).catch((error) => {
    console.error('Error connecting to the database', error);
  });

const startBot = (db: mongoose.mongo.Db) => {
  const bot = setupBot(db);
  bot.launch();

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}