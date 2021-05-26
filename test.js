import fs from 'fs';

function m(source, regExp) {
    const m = source.match(regExp);
    console.log('🔸 m:', m);
    return m && m[1] || '';
}

function mj(source, regExp) {
    try {
        return JSON.parse(m(source, regExp));
    } catch {
        return null;
    }
}

// const html = fs.readFileSync('dumps/home.html', { charset: 'utf8' }).toString();

const html = `
<script>
	//if the season has ended. Used in battle.js
	var season_reset = null;

	///// Create the JS version of the opponents
	var hh_battle_players = [
		{"id_member":"452891","orgasm":94864,"ego":123300,"x":0,"curr_ego":123300,"nb_org":0,"figure":5},
		{"id_troll":"8","orgasm":36389,"ego":49279.8,"x":0,"curr_ego":49279.8,"nb_org":0,"figure":12,"id_world":"9"}
	];

	var GT_figures = ["fig0","Doggie style","Dolphin","Missionary","Sodomy","69","Jack Hammer","Nose Dive","Column","Indian Headstand","Suspended Congress","Splitting Bamboo","Bridge"];

	$('#battle .season_arena_block').find('.change_team_container, .js_kisses_bar').hide();
</script>
`;

const hh_battle_players = mj(html.replace(/[\n\t]/g, ' '), /hh_battle_players = (\[.*?\]);/im);
console.log('🔸 hh_battle_players:', hh_battle_players);
