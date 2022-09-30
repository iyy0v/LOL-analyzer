import axios from "axios";

export function getAccount(name,region) {
    const API_KEY = process.env.REACT_APP_API_KEY;
    axios({
        url: "https://" + region + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + name + "?api_key=" + API_KEY,
        method: "GET"
      })
      .then((res) => {return res})
      .catch((err) => {console.log(err)});
}

export function getRank(id,region) {
    const API_KEY = process.env.REACT_APP_API_KEY;
    axios({
        url: "https://" + region + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + id + "?api_key=" + API_KEY,
        method: "GET"
    })
    .then((res) => {console.log(res); return res})
    .catch((err) => {console.log(err)});
}

export function getMatches(region,puuid,start,count) {
    const API_KEY = process.env.REACT_APP_API_KEY;
    switch(region) {
        case "euw1":
        case "eun1":
        case "ru":
        case "tr1":
            region = "europe";
            break;
        case "na1":
        case "la1":
        case "la2":
        case "br1":
            region = "americas";
            break;
        case "kr":
        case "jp1":
            region = "asia";
            break;
        default:
            region = "sea";
            break;
    }
    axios({
        url: "https://" + region + ".api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?start=" + start +"&count=" + count +"&api_key=" + API_KEY,
        method: "GET"
        })
        .then((matches) => {
            console.log(matches)
            for(let i in matches.data) {
                axios({
                    url: "https://" + region + ".api.riotgames.com/lol/match/v5/matches/" + matches.data[i] + "?api_key=" + API_KEY,
                    method: "GET"
                })
                .then((matches) => {
                    console.log(matches)
                })
                .catch((err) => {console.log(err)});
            }
        })
        .catch((err) => {console.log(err)});
}

export function filterRank(rank) {
    rank = rank.data;
    const res = {};
    res['solo'] = undefined;
    res['flex'] = undefined;
    for(let i in rank) {
        if(rank[i].queueType === 'RANKED_SOLO_5x5') res['solo'] = rank[i];
        if(rank[i].queueType === 'RANKED_FLEX_SR') res['flex'] = rank[i];
    }
    return res;
}
