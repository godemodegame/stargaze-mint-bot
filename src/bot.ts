import { Scenes, Telegraf } from 'telegraf';
import { registerScene } from './scenes';

import mongoose from "mongoose";
import { session } from 'telegraf-session-mongodb';

import dotenv from 'dotenv';

import { 
    start, 
    startRegistration, 
    watchSeed 
} from './commands';

dotenv.config();

const bot = new Telegraf<Scenes.SceneContext>(process.env.BOT_TOKEN);

const stage = new Scenes.Stage<Scenes.SceneContext>([registerScene]);

const setupBot = (db: mongoose.mongo.Db) => {
    return bot
        .use(session(db, { 
            sessionName: "session", 
            collectionName: "sessions" 
        }))
        .use(stage)
        .start(start)
        .action("changeSeed", startRegistration)
        .action("watchSeed", watchSeed)
        .action("back", start);
}

export default setupBot;