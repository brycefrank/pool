var XLSX = require('xlsx');
var plot = require('./plot');
var d3 = require('d3');

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

function get_player_summary(rows, subset_team=["H1"]) {
    player_scores = [];

    // TODO detect this automatically somehow?
    var j = 0;
    for (var i = 0; i<rows.length; i++) {
        row = rows[i];
        name = row["__EMPTY_1"];
        num_games = row["Games"]
        team = row["__EMPTY"]

        if((name!="undefined") && (name!="Forfeits") && (num_games > 20) && (subset_team.includes(team))) {
            wins = get_player_wins(row, current_week);
            player_scores[j] = {
                "name": name,
                "team": team,
                "num_games": num_games,
                "record": wins,
                "cumulative_wins": get_cumulative_wins(wins, current_week)
            }
            j += 1;
        }
    }
    return(player_scores);
}

function parse_selection() {
    selected = []
    d3.selectAll('option')
        .each(function(d){
            cb = d3.select(this);
            if(cb.property("selected")) {
                selected.push(cb.property("value"))
            }
        })
    return(selected)
}

function plot_subset() {
    team_selection = parse_selection()
    cumulative_plot.erase_lines()
    player_summary = get_player_summary(rows, team = team_selection)
    cumulative_plot.draw_lines(player_summary)
}

req.onload = function(e) {
  var data = new Uint8Array(req.response);
  var workbook = XLSX.read(data, {type:"array"});

  rows = XLSX.utils.sheet_to_json(workbook.Sheets["Sheet1"]);

  // Plot initial
  player_summary = get_player_summary(rows);
  cumulative_plot = new plot.CumulativeWins(player_summary, current_week);
  cumulative_plot.draw_lines(player_summary)
  d3.select("#teams").on("change", plot_subset);
}

req.send();