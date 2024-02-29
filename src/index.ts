import mongoose from "mongoose";

import setupBot from "./bot";
import startApp from "./app";

import mint from './models/mint';
import { executeContract } from "./helpers";

import { Telegraf } from "telegraf";
import { SceneContext, SceneSessionData } from "telegraf/typings/scenes";

let bot: Telegraf<SceneContext<SceneSessionData>>;

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
    setInterval(checkMints, 1000);
  }).catch((error) => {
    console.error('Error connecting to the database', error);
  });

const startBot = (db: mongoose.mongo.Db) => {
  bot = setupBot(db);
  bot.launch();

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
}

const checkMints = async () => {
  const mints = await mint.find({ minted: false });
  for (const mint of mints) {
    if (mint.mintdate < new Date()) {
      try {
        await executeContract(mint.telegram_id, mint.contractAddress, mint.price, mint.amount, mint.mintdate);
        bot.telegram.sendMessage(mint.telegram_id, `Minted ${mint.amount} tokens\n\nContract: ${mint.contractAddress}\nPrice: ${mint.price}`);
        mint.minted = true;
        await mint.save();
      } catch (error) {
        console.log(error);
      }
    }
  }
}