import { Markup } from "telegraf";

export const backButton = 
    Markup.inlineKeyboard([
        Markup.button.callback('⬅️ Back', 'back')
    ])