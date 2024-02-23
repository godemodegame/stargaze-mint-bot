import { Context } from 'telegraf';
import user from '../models/user';

const newUser = async (context: Context) => {
    const userData = await user.findOne({ telegram_id: context.from.id });
    if (userData === null || userData === undefined) {
        await new user({ 
            telegram_id: context.from.id 
        }).save();
    }
}

export default newUser;