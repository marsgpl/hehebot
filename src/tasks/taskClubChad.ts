import fail from '../helpers/fail.js';
import { HeheBot, TASK_FETCH_HOME } from '../class/HeheBot.js';

const TASK_NOTE = 'club';

export default async function taskClubChad(bot: HeheBot) {
    const canClaimChadReward = bot.state.notificationData?.clubs?.includes('reward');

    if (canClaimChadReward) {
        const html = await bot.fetchHtml('/clubs.html');

        if (html.match(/Champion is impressed/i)) {
            await bot.incCache({ chadRewards: 1 });
        } else {
            throw fail('taskClubChad', 'canClaimChadReward but reward not found');
        }
    }
}
