import { Markup } from "telegraf";
import { SceneContext } from 'telegraf/typings/scenes';

import { addSeedButton } from '../buttons';

import User from '../models/user';
import { newComer, walletAddress } from '../helpers';

const start = async (context: SceneContext) => {
    await newComer(context);
    const user = await User.findOne({ telegram_id: context.from.id })
    if (user?.seed === null || user?.seed === undefined) {
        context.reply(
            "Welcome!\n\nFirstly we need your seed-phrase. \nBetter to generate new because I'll store it in my server", 
            addSeedButton
        )
    } else {
        const address = (await walletAddress(user.seed)).address
        context.reply(
            `Welcome back, ${context.from.first_name}\n\nYour wallet: ${ address }`,
            Markup.inlineKeyboard([
                [Markup.button.webApp('🔨 Mint', process.env.WEBAPP_URL)],
                user.role === 'admin' ?
                    [{ text: '👛 Change seed', callback_data: 'changeSeed'}, { text: '✉️ Send', callback_data: 'sendMessages'}] :
                    [{ text: '👛 Change seed', callback_data: 'changeSeed'}],
                [{text: '👀 Watch seed', callback_data: 'watchSeed'}]
            ])
        );
    }
};

export default start;