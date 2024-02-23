import { Markup } from "telegraf";

export const addSeedButton = 
    Markup.inlineKeyboard([
        Markup.button.callback('🎉 Add seed!', 'changeSeed')
    ])