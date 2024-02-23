import { Markup } from "telegraf";

export const changeSeedButton = 
    Markup.inlineKeyboard([
        Markup.button.callback('👛 Change-seed', 'changeSeed')
    ])