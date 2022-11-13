import { useEffect, useState } from "react";
import axios from "axios";
import { getRegionName2, joinChampions, toDateTime } from "../scripts";

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
                    console.log(match);

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
                    console.log(mode);

                    let player;
                    const teams = {100:[],200:[]};
                        // add players to the card
                    fetch('http://ddragon.leagueoflegends.com/cdn/' + patch + '/data/en_US/champion.json')
                    .then(res2 => res2.json()).then(champs => {
                        const players = joinChampions(match.participants,champs);
                        console.log(players);
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
                        let color;
                        if(player.teamEarlySurrendered) color = "backdrop-hue-rotate-90 bg-gray-800/80";
                        else {
                            if(player.win) color = "backdrop-hue-rotate-90 bg-green-600/30";
                            else color = "backdrop-hue-rotate-180 bg-red-600/30";
                        }
                        console.log(teams);
                        console.log(player);

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
                                    <div>
                                        
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