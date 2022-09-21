import axios from "axios";

export default function AccCard({accInfo,rankInfo,region,patch,setCurAcc}) {
    const API_KEY = process.env.REACT_APP_API_KEY;
    const name = accInfo.data.name;
    const level = accInfo.data.summonerLevel;
    const icon = accInfo.data.profileIconId;
    const iconURL = "https://ddragon.leagueoflegends.com/cdn/" + patch + "/img/profileicon/" + icon + ".png";
    const ranked = rankInfo.data;
    let rankedData;
    let type;
    let tier;
    let rank;
    let lp;
    for (let i in ranked) {
        if (ranked[i].queueType==="RANKED_SOLO_5x5") { 
            rankedData = ranked[i]; 
            type = "Solo/Duo";
            break; }
        else if (ranked[i].queueType==="RANKED_FLEX_SR") { 
            rankedData = ranked[i]; 
            type = "Flex";
        }
    }
    if(rankedData) {
        tier = rankedData.tier;
        rank = rankedData.rank;
        lp = rankedData.leaguePoints;
    }

    const loadAccount = () => {
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
            case "oc1":
                region = "asia";
                break;
            default:
                region = "sea";
                break;
        }
        axios({
            url: "https://" + region + ".api.riotgames.com/lol/match/v5/matches/by-puuid/" + accInfo.data.puuid + "/ids?api_key=" + API_KEY,
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
    

    return(
        <div onClick={loadAccount} className="w-11/12 h-18 p-1 py-3 flex flex-row gap-3 z-1 cursor-pointer hover:ring-2 hover:rounded ">
            <div className="col-span-1 min-w-16 ">
                <img src={iconURL} alt="profile icon" className="w-16 rounded-2xl"/>
            </div>
            <div className="col-span-3 w-full">
                <p className="text-2xl">{name}</p>
                <div className="flex flex-row justify-between gap-2 text-gray-400">
                    <p>lvl {level}</p>
                    <p>{tier} {rankedData ? <>{rank} - {lp}LP <small>({type})</small></> : "Unranked"}</p>
                </div>
            </div>
        </div>
    );
}