const readXlsxFile = require('read-excel-file/node');
const D3Node = require('d3-node');
const d3 = require('d3');

var d3n = new D3Node();

var svg = d3n.createSVG(200, 200).append('g');

function get_cumulative_wins(wins, current_week) {
    cumulative_wins = [];
    current = 0;

    for (var i = 0; i < current_week; i++) {
        wins_i = parseInt(wins[[i]]);

        if (!wins_i) {
            wins_i = 0;
        }

        cumulative_wins[i] = current + wins_i;
        current = current + wins_i;
    }
    return cumulative_wins;
}

player_scores_token = readXlsxFile('data/data.xlsx').then(rows => {
    player_scores = {};

    // TODO detect this automatically somehow?
    current_week = 6;

    for (var i = 0; i < rows.length; i++) {
        row = rows[i];
        name = row[1];

        if (name && name != "Forfeits") {
            wins = row.slice(2, 22);
            player_scores[name] = {};
            player_scores[name]["record"] = wins;
            player_scores[name]["cumulative_wins"] = get_cumulative_wins(wins, current_week);
        }
    }
    return player_scores;
});

player_scores_token.then(player_scores => {
    console.log(player_scores);
});

require('output')('histogram', d3n);