import { useEffect, useState } from "react";
import axios from "axios";
import { getRegionName2, joinChampions, joinSpells, toDateTime } from "../scripts";

export default function History(props) {
    const [loaded,setLoaded] = useState(false);
    const [cards,setCards] = useState([]);

    const patch = props.props.patch;
    const info = props.props.info;
    const region = props.props.region;
    const matches = props.props.matches.data;

    function setup() {
        const API_KEY = process.env.REACT_APP_API_KEY;
        let regionName = getRegionName2(region);

        console.log(matches);
        setTimeout(() => {

        for(let i in matches) {
            setTimeout(() => {
                axios({
                    url: "https://" + regionName + ".api.riotgames.com/lol/match/v5/matches/" + matches[i] +"?api_key=" + API_KEY,
                    method: "GET"
                })
                .then((res) => { // Set Match result
                    const match = res.data.info;

                    let date = new Date(match.gameStartTimestamp);
                    date = date.toString().split(" GMT")[0];
                    let time = date.substring(16);
                    date = toDateTime(date);

                    const duration = Math.floor(match.gameDuration / 60) + "min " + (match.gameDuration % 60 === 0 ? "" : (match.gameDuration % 60) + "s" );

                    let mode;
                    switch(match.queueId) {
                        case 0:
                            mode = "Custom";
                            break;
                        case 400:
                            mode = "Normal (Draft)";
                            break;
                        case 420:
                            mode = "Ranked (Solo)";
                            break;
                        case 430:
                            mode = "Normal (Blind)";
                            break;
                        case 440:
                            mode = "Ranked (Flex)";
                            break;
                        case 450:
                            mode = "ARAM";
                            break;
                        default:
                            mode = "Others"
                            break;
                    }

                    let player;
                    const teams = {100:[],200:[]};
                        // add players to the card
                    fetch('http://ddragon.leagueoflegends.com/cdn/' + patch + '/data/en_US/champion.json')
                    .then(res2 => res2.json()).then(champs => {
                        const players = joinChampions(match.participants,champs);
                        for(let j in players) {
                            if(players[j].summonerId === info.id) {
                                player = players[j];
                                teams[player.teamId].push(
                                    <div key={players[j].summonerId} className="flex flex-row align-middle my-1">
                                        <div className="champImg min-h-max">
                                            <span className="tooltip">{players[j].champion.name}</span>
                                            <img src={"http://ddragon.leagueoflegends.com/cdn/" + patch + "/img/champion/" + players[j].champion.id + ".png"} alt={players[j].champion.name + "'s image"} className="rounded-md w-[25px] h-[25px]"/>
                                        </div>
                                        <p className="text-sm text-gray-300 pt-1 ml-2"><strong>{players[j].summonerName}</strong></p>
                                    </div>
                                );
                            }
                            else {
                                teams[players[j].teamId].push(
                                    <div key={players[j].summonerId} className="flex flex-row align-middle my-1">
                                        <div className="champImg min-h-max">
                                            <span className="tooltip">{players[j].champion.name}</span>
                                            <img src={"http://ddragon.leagueoflegends.com/cdn/" + patch + "/img/champion/" + players[j].champion.id + ".png"} alt={players[j].champion.name + "'s image"} className="rounded-md w-[25px] h-[25px]"/>
                                        </div>
                                        <p className="text-sm text-gray-300 pt-1 ml-2">{players[j].summonerName}</p>
                                    </div>
                                );
                            }
                        }
                        fetch('http://ddragon.leagueoflegends.com/cdn/' + patch + '/data/en_US/summoner.json')
                        .then(res3 => res3.json()).then(spells => { // add spells info to the player
                            player = joinSpells(spells,player);
                            let color;
                            if(player.teamEarlySurrendered) color = "backdrop-hue-rotate-90 bg-gray-800/80";
                            else {
                                if(player.win) color = "backdrop-hue-rotate-90 bg-green-600/30";
                                else color = "backdrop-hue-rotate-180 bg-red-600/30";
                            }
                            console.log(player);
                            const KDA = ((player.kills + player.assists) / player.deaths).toFixed(1);
                            const CScore = player.totalMinionsKilled + player.neutralMinionsKilled;
                            const CSPM = (CScore*60 / player.timePlayed).toFixed(1);
                            const VScore = player.visionScore;

                            matches[i] = (
                                <div key={match.gameId} className={"flex flex-row justify-between rounded-md px-5 py-3 my-2 " + color}>
                                    <div className="flex flex-col justify-between">
                                        <div className="py-2 border-b border-slate-50/20">
                                            <p className="font-semibold">{mode}</p>
                                        </div>
                                        <p>{duration}</p>
                                        <div className="border-t border-slate-50/20">
                                            <p>{date}</p>
                                            <p>{time}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex flex-row">
                                            <div className="flex flex-col">
                                                <div>
                                                    <img src={"http://ddragon.leagueoflegends.com/cdn/" + patch + "/img/champion/" + player.champion.id + ".png"} alt={player.champion.name + " image"} className="w-[60px] h-[60px] rounded-md"/>
                                                    <p className="text-sm w-min px-1 relative top-[-20px] right-[-18px] mx-auto rounded bg-slate-900 ">{player.champLevel}</p>
                                                </div>
                                                <div>

                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold inline">{player.kills}</p>
                                                <p className="text-lg text-slate-50/20 inline"> / </p>
                                                <p className="text-lg text-red-600 font-bold inline">{player.deaths}</p>
                                                <p className="text-lg text-slate-50/20 inline"> / </p>
                                                <p className="text-lg font-bold inline">{player.assists}</p>
                                                <p className="text-slate-50/80">{KDA + ":1 KDA"}</p>
                                                <p className="text-slate-50/80">{"CS " + CScore + " (" + CSPM + ")"}</p>
                                                <p className="text-slate-50/80">{"Vision Score : " + VScore}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row">
                                        <div className="min-w-[170px]">
                                            {teams[100]}
                                        </div>
                                        <div className="min-w-[170px]">
                                            {teams[200]}
                                        </div>
                                    </div>
                                </div>
                            );
                            setCards(matches);
                        })
                        .catch((err) => console.log(err));
                    })
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
            },200);
        }
        

        setTimeout(() => {
            setLoaded(true);
        },3000);
        
        },4000);
    }

    function render() {
            return(
                cards
            )
    }
    useEffect(() => {
        if(!loaded) setup();
    },[loaded]);

    return(
        <div id="history" className="p-4 mt-4 rounded shadow-md backdrop-brightness-90">
            <h2 className="text-2xl text-center mb-3">Matches History</h2>
            {loaded
            ?
                render()
            :
                "Loading..."
            }
        </div>
    )
}