import { Scenes } from 'telegraf';

import { start } from '../commands';
import { signer } from '../helpers';

import user from '../models/user';

const registerScene = new Scenes.WizardScene(
  'WIZARD_SCENE_ID',
  async (context: any) => {
    await context.reply('Enter your seed-phrase');
    return context.wizard.next();
  },
  async (context) => {
    context.deleteMessage();
    if (!await signer(context.message.text)) {
      context.reply('Error, wrong seed-phrase. Try again');
      return;
    }
    let userData = await user.findOne({ telegram_id: context.message.from.id });
    if (userData) {
      userData.seed = context.message.text;
      userData.save();
      await context.reply('Seed-phrase has been updated');
      start(context);
      return await context.scene.leave();
    } else {
      new user({ 
        seed: context.message.text, 
        telegram_id: context.message.from.id 
      }).save();
      await context.reply('Seed-phrase has been saved');
      start(context);
      return await context.scene.leave();
    }
  }
);

export default registerScene;