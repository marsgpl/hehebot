



// const WORLD_URL = `${BASE_URL}/world/`; // + worldId
// const TROLL_URL = `${BASE_URL}/battle.html?id_troll=`; // + trollId
// const ACTIVITIES_URL = `${BASE_URL}/activities.html`;






//     protected async fetchWorld(worldId: number) {
//         const html = await this.getPage(WORLD_URL + worldId);

//         const trollInfo = mj(html, /trollInfo = (\{.*?\});/i);

//         if (!trollInfo?.id_troll) {
//             // troll not found
//             return;
//         }

//         this.state.trollInfo = trollInfo;
//     }

//     protected async fetchTroll(trollId: number) {
//         const html = await this.getPage(TROLL_URL + trollId);

//         const hh_battle_players = mj(
//             html.replace(/[\n\t]/g, ' '),
//             /hh_battle_players = (\[.*?\]);/im);

//         if (!hh_battle_players?.[0] || !hh_battle_players?.[1]) {
//             throw 'hh_battle_players not found';
//         }

//         this.state.hh_battle_players = {
//             member: hh_battle_players[0],
//             troll: hh_battle_players[1],
//         };
//     }


//     protected async fightWithTroll() {
//         const worldId = Number(this.state.heroInfo?.questing?.id_world);
//         if (!worldId) throw 'worldId not found';

//         const fightEnergyCurrent = Number(this.state.heroEnergies?.fight?.amount);
//         const fightEnergyMax = Number(this.state.heroEnergies?.fight?.max_amount);
//         if (!fightEnergyMax || isNaN(fightEnergyCurrent)) throw 'fightEnergy not found';

//         // we fight with troll only if energy > 50%
//         if (fightEnergyCurrent < fightEnergyMax / 2) return;

//         await this.fetchWorld(worldId);

//         const trollId = Number(this.state.trollInfo?.id_troll);

//         if (!trollId) {
//             return;
//         }

//         await this.fetchTroll(trollId);

//         const trollInfo = this.state.hh_battle_players?.troll;
//         if (!trollInfo) throw 'trollInfo not found';

//         while (true) {
//             const success = await this._attackTroll(trollInfo);
//             if (!success) break;
//         }
//     }

//     protected async _attackTroll(trollInfo: json): Promise<boolean> {
//         const trollParams: json = {};

//         Object.keys(trollInfo).forEach(key => {
//             trollParams[`who[${key}]`] = String(trollInfo[key]);
//         });

//         const json = await this.postAjax({
//             class: 'Battle',
//             action: 'fight',
//             battles_amount: '0',
//             ...trollParams,
//         });

//         if (json.error && json.error === 'Not enough fight energy.') {
//             return false;
//         }

//         if (!json.success) {
//             throw `_attackTroll failed: ${JSON.stringify(json)}`;
//         }

//         if (json.end?.battle_won) {
//             const energyDelta = Number(json.end?.updated_infos?.energy_fight);
//             if (!energyDelta) throw '_attackTroll: energy was not spent';

//             this.cache.trollFights = (this.cache.trollFights || 0) + 1;

//             if (this.state.heroEnergies?.fight?.amount) {
//                 this.state.heroEnergies.fight.amount--;
//             }

//             await this.saveCache();

//             return true;
//         } else {
//             throw '_attackTroll: we lost the battle';
//         }
//     }
