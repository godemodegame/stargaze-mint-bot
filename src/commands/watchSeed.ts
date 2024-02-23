import User from '../models/user';
import { backButton } from '../buttons';
import { Context } from 'telegraf';

const watchSeed = async (context: Context) => {
    const user = await User.findOne({ telegram_id: context.from.id });
    if (user.seed === null || user.seed === undefined) {
        return context.reply("You don't have seed-phrase", backButton);
    }
    context.replyWithMarkdownV2(`Your seed\\-phrase is:\n\n||${user.seed}||`, backButton);
};

export default watchSeed;