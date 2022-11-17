import axios from "axios";

export function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function toDateTime(input) {
    var d = new Date(input).toLocaleString("en-GB").split(',')[0];
    return d;

}

export function getRegionName(region) {
    switch(region) {
        case "euw1":
            region = "EUW";
            break;
        case "eun1":
            region = "EUNE";
            break;
        case "ru":
            region = "RU";
            break;
        case "tr1":
            region = "TR";
            break;
        case "na1":
            region = "NA";
            break;
        case "la1":
            region = "LAN";
            break;
        case "la2":
            region = "LAS";
            break;
        case "br1":
            region = "BR";
            break;
        case "kr":
            region = "KR";
            break;
        case "jp1":
            region = "JP";
            break;
        default:
            region = "SEA";
            break;
    }
    return region;
}

export function getRegionName2(region) {
        switch(region) {
            case "euw1":
            case "eun1":
            case "ru":
            case "tr1":
                return "europe";
            case "na1":
            case "la1":
            case "la2":
            case "br1":
                return "americas";
            case "kr":
            case "jp1":
                return "asia";
            default:
                return "sea";
        }
}

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

export function joinChampions(res1,champs) {
    champs = champs.data;
    for(let i in res1) {
        for(let j in champs) {
            if(res1[i].championId == champs[j].key) { res1[i].champion = champs[j] }
        }
    }
    return res1;
}

export function joinSpells(spells,player) {
    spells = spells.data;
    player.spells = [];
    for(let i in spells) {
        if(spells[i].key == player.summoner1Id) {
            player.spells[0] =  spells[i];
            break;
        } 
    }
    for(let i in spells) {
        if(spells[i].key == player.summoner12Id) {
            player.spells[1] =  spells[i];
            break;
        } 
    }
    return player;
}

export function getResult(puuid,match) {
    const players = match.data.info.participants;
    for(let i in players) {
        if(puuid === players[i].puuid) return players[i].win;
    }
    return false;
}

export function findSummoner(summoner,summoners) {
    for(let i in summoners) {
        if(summoners[i].summonerName === summoner) return summoners[i];
    }
}