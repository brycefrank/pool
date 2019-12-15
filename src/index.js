var XLSX = require('xlsx');
var plot = require('./plot');

url = '../data/data.xlsx';
var req = new XMLHttpRequest();
req.open("GET", url, true);
req.responseType = "arraybuffer";
const current_week = 6;

function get_player_wins(row, current_week) {
    player_wins = [];
    for(var i = 0; i <current_week; i++) {
        wk = i+1;
        player_wins[i] = row[wk];
    }
    return(player_wins);
}

function get_cumulative_wins(wins, current_week) {
    cumulative_wins = []
    current = 0

    for (var i = 0; i < current_week; i++) {
        wins_i = parseInt(wins[[i]])

        if(!wins_i) {
            wins_i = 0
        }

        cumulative_wins[i] = current + wins_i
        current = current + wins_i
    }
    return(cumulative_wins)
}

function get_player_summary(rows) {
    player_scores = [];

    // TODO detect this automatically somehow?
    var j = 0;
    for (var i = 0; i<rows.length; i++) {
        row = rows[i];
        name = row["__EMPTY_1"];

        if((name!="undefined") && (name!="Forfeits")) {
            wins = get_player_wins(row, current_week);
            player_scores[j] = {}
            player_scores[j]["name"] = name
            player_scores[j]["record"] = wins
            player_scores[j]["cumulative_wins"] = get_cumulative_wins(wins, current_week)
            j += 1;
        }
    }
    return(player_scores);
}


req.onload = function(e) {
  var data = new Uint8Array(req.response);
  var workbook = XLSX.read(data, {type:"array"});

  rows = XLSX.utils.sheet_to_json(workbook.Sheets["Sheet1"]);
  player_summary = get_player_summary(rows);
  plot.plot_cumulative_wins(player_summary, current_week);
}

req.send();