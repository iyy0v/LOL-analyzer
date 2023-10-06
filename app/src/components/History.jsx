import { useEffect, useState } from "react";
import axios from "axios";
import { getMulti, getFirstBlood, getUnkillable, getFarmer, getRegionName, getRegionName2, joinChampions, joinItems, joinRunes, joinSpells, toDateTime, showError, hideError } from "../scripts";

export default function History(props) {
    const [response,setResponse] = useState(false);
    const [loaded,setLoaded] = useState(false);
    const [cards,setCards] = useState([]);

    const patch = props.props.patch;
    const info = props.props.info;
    const region = props.props.region;
    const matches = props.props.matches.data;
    const matchesCards = [];

    const API_KEY = process.env.REACT_APP_API_KEY;

    function searchSummoner(event) {
        const summoner = event.target.textContent;
        const region = document.getElementById("region").value;
        const regionName = getRegionName(region);

        console.log(event.target.textContent);
        
        axios({
            url: "https://" + region + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summoner + "?api_key=" + API_KEY,
            method: "GET"
          })
          .then((res1) => {
              axios({
              url: "https://" + region + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + res1.data.id + "?api_key=" + API_KEY,
              method: "GET"
              })
              .then((res2) => {
                  props.props.addAccount(res1,res2,region,regionName);
                  props.props.loadAccount(res1,region);
              })
              .catch((err) => {console.log(err)});
          })
          .catch((err) => {
              console.log(err);
              showError("Summoner not found","Please check the username again.");
              setTimeout(() => {
                  hideError();
              },6000);
          });
    }

    function setup() {
        const API_KEY = process.env.REACT_APP_API_KEY;
        setLoaded(false);
        let regionName = getRegionName2(region);

        for(let i in matches) {
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
                fetch('https://ddragon.leagueoflegends.com/cdn/' + patch + '/data/en_US/champion.json')
                .then(res2 => res2.json()).then(champs => {
                    const players = joinChampions(match.participants,champs);
                    for(let j in players) {
                        if(players[j].summonerId === info.id) {
                            player = players[j];
                            teams[player.teamId].push(
                                <div key={players[j].summonerId} className="flex flex-row align-middle my-1">
                                    <div className="imgTooltip inline-block min-h-max">
                                        <span className="tooltip">{players[j].champion.name}</span>
                                        <img src={"https://ddragon.leagueoflegends.com/cdn/" + patch + "/img/champion/" + players[j].champion.id + ".png"} alt={players[j].champion.name + "'s image"} className="rounded-md w-[25px] h-[25px]"/>
                                    </div>
                                    <p className="text-sm text-gray-300 pt-1 ml-2"><strong>{players[j].summonerName}</strong></p>
                                </div>
                            );
                        }
                        else {
                            teams[players[j].teamId].push(
                                <div key={players[j].summonerId} className="flex flex-row align-middle my-1">
                                    <div className="imgTooltip inline-block min-h-max">
                                        <span className="tooltip">{players[j].champion.name}</span>
                                        <img src={"https://ddragon.leagueoflegends.com/cdn/" + patch + "/img/champion/" + players[j].champion.id + ".png"} alt={players[j].champion.name + "'s image"} className="rounded-md w-[25px] h-[25px]"/>
                                    </div>
                                    <p className="text-sm text-gray-300/80 pt-1 ml-2 hover:text-gray-300 hover:cursor-pointer" onClick={searchSummoner}>{players[j].summonerName}</p>
                                </div>
                            );
                        }
                    }
                    fetch('https://ddragon.leagueoflegends.com/cdn/' + patch + '/data/en_US/summoner.json')
                    .then(res3 => res3.json())
                    .then(spells => { // add spells info to the player
                        console.log(player);
                        console.log(spells);
                        player = joinSpells(spells,player);
                        
                        fetch('https://ddragon.leagueoflegends.com/cdn/' + patch +'/data/en_US/runesReforged.json')
                        .then(res4 => res4.json()).then(runes => { // add runes info to player
                            player = joinRunes(runes,player);
                            
                            fetch('https://ddragon.leagueoflegends.com/cdn/' + patch +'/data/en_US/item.json')
                            .then(res4 => res4.json()).then(items => { // add items info to player
                                player = joinItems(items,player);
                                const itemsElements = player.items.map((item,i) => (
                                    item === undefined
                                    ?
                                    <div key={i} className="block shadow-sm backdrop-brightness-90 w-[30px] h-[30px] rounded"></div>
                                    :
                                    <div key={i} className="imgTooltip block h-min">
                                        <span className="tooltip">{item.name}</span>
                                        <img src={"https://ddragon.leagueoflegends.com/cdn/" + patch + "/img/item/" + item.image.full} alt={item.name + " icon"} className="w-[30px] h-[30px] rounded" />
                                    </div>
                                ));
                                itemsElements[6] =  player.items[6] === undefined
                                                    ?
                                                    <div key="6" className="block shadow-sm backdrop-brightness-90 w-[30px] h-[30px] rounded"></div>
                                                    :
                                                    <div key="6" className="imgTooltip block h-min">
                                                        <span className="tooltip">{player.items[6].name}</span>
                                                        <img src={"https://ddragon.leagueoflegends.com/cdn/" + patch + "/img/item/" + player.items[6].image.full} alt={player.items[6].name + " icon"} className="w-[30px] h-[30px] ml-2 rounded-full" />
                                                    </div>;
                                let color;
                                if(player.teamEarlySurrendered) color = "backdrop-hue-rotate-90 bg-gray-800/80";
                                else {
                                    if(player.win) color = "backdrop-hue-rotate-90 bg-green-600/30";
                                    else color = "backdrop-hue-rotate-180 bg-red-600/30";
                                }
                                //console.log(player);
                                const KDA = ((player.kills + player.assists) / player.deaths).toFixed(1);
                                const CScore = player.totalMinionsKilled + player.neutralMinionsKilled;
                                const CSPM = (CScore*60 / player.timePlayed).toFixed(1);
                                const VScore = player.visionScore;
                                const multiKills = getMulti(player);
                                const firstBlood = getFirstBlood(player);
                                const unkillable = getUnkillable(player);
                                const farmer = getFarmer(player);
                                matchesCards[i] = (
                                    <div key={match.gameId} className={"flex flex-row justify-content-stretch rounded-md px-5 py-3 my-2 min-w-[1000px]" + color}>
                                        <div key="gameInfo" className="flex flex-col justify-between justify-self-start min-w-[100px]">
                                            <div className="py-2 border-b border-slate-50/20">
                                                <p className="font-semibold">{mode}</p>
                                            </div>
                                            <p>{duration}</p>
                                            <div className="border-t border-slate-50/20">
                                                <p>{date}</p>
                                                <p>{time}</p>
                                            </div>
                                        </div>
                                        <div key="playerStats" className="min-w-min grow justify-self-stretch flex flex-row">
                                            <div className="xl:min-w-[0%] 2xl:min-w-[25%] shrink">
                                            </div>
                                            <div className="flex flex-row px-3">
                                                <div className="flex flex-col pr-3 mr-3 min-w-fit border-r border-slate-50/20">
                                                    <div key="runes and spells" className="flex flex-row min-w-fit max-w-[30%]">
                                                        <div key="champ" className="mr-3 min-w-fit">
                                                            <div className="imgTooltip block">
                                                                <span className="tooltip">{player.champion.name}</span>
                                                                <img src={"https://ddragon.leagueoflegends.com/cdn/" + patch + "/img/champion/" + player.champion.id + ".png"} alt={player.champion.name + " image"} className="w-[64px] h-[64px] rounded-md"/>
                                                            </div>
                                                            <p className="text-sm w-min px-1 relative top-[-20px] right-[-18px] mx-auto rounded bg-slate-900 ">{player.champLevel}</p>
                                                        </div>
                                                        <div key="spells" className="mr-3 min-w-fit">
                                                            <div key={player.spells[0].name} className="imgTooltip block">
                                                                <span className="tooltip">{player.spells[0].name}</span>
                                                                <img src={"https://ddragon.leagueoflegends.com/cdn/" + patch +"/img/spell/" + player.spells[0].image.full} alt={player.spells[0].name + " image"} className="w-[30px] h-[30px] rounded-md mb-1 block" />
                                                            </div>
                                                            <div key={player.spells[1].name} className="imgTooltip block">
                                                                <span className="tooltip">{player.spells[1].name}</span>
                                                                <img src={"https://ddragon.leagueoflegends.com/cdn/" + patch +"/img/spell/" + player.spells[1].image.full} alt={player.spells[1].name + " image"} className="w-[30px] h-[30px] rounded-md block" />
                                                            </div>
                                                        </div>
                                                        <div key="mainRune" className="min-w-fit">
                                                            <div className="imgTooltip block">
                                                                <span className="tooltip">{player.runes[0][0].name}</span>
                                                                <img src={"https://ddragon.canisback.com/img/" + player.runes[0][0].icon} alt={player.runes[0][0].name + " icon"} className="w-[40px] h-[40px] rounded-full" />
                                                            </div>
                                                        </div>
                                                        <div key="runes" className="min-w-fit">
                                                            <div key="primaryRunes" className="grid grid-cols-3 gap-1 content-center h-[40px] min-w-fit">
                                                                <div key={player.runes[0][1].name} className="imgTooltip block h-min">
                                                                    <span className="tooltip">{player.runes[0][1].name}</span>
                                                                    <img src={"https://ddragon.canisback.com/img/" + player.runes[0][1].icon} alt={player.runes[0][1].name + " icon"} className="w-[25px] h-[25px] rounded-full" />
                                                                </div>
                                                                <div key={player.runes[0][2].name} className="imgTooltip block h-min">
                                                                    <span className="tooltip">{player.runes[0][2].name}</span>
                                                                    <img src={"https://ddragon.canisback.com/img/" + player.runes[0][2].icon} alt={player.runes[0][2].name + " icon"} className="w-[25px] h-[25px] rounded-full" />
                                                                </div>
                                                                <div key={player.runes[0][3].name} className="imgTooltip block h-min">
                                                                    <span className="tooltip">{player.runes[0][3].name}</span>
                                                                    <img src={"https://ddragon.canisback.com/img/" + player.runes[0][3].icon} alt={player.runes[0][3].name + " icon"} className="w-[25px] h-[25px] rounded-full" />
                                                                </div>
                                                            </div>
                                                            <div key="secondaryRunes" className="grid grid-cols-3 gap-1 h-[30px] min-w-fit">
                                                                <div key={player.runes[1][0].name} className="imgTooltip block h-min">
                                                                    <span className="tooltip">{player.runes[1][0].name}</span>
                                                                    <img src={"https://ddragon.canisback.com/img/" + player.runes[1][0].icon} alt={player.runes[1][0].name + " icon"} className="w-[25px] h-[25px] rounded-full" />
                                                                </div>
                                                                <div key={player.runes[1][1].name} className="imgTooltip block h-min">
                                                                    <span className="tooltip">{player.runes[1][1].name}</span>
                                                                    <img src={"https://ddragon.canisback.com/img/" + player.runes[1][1].icon} alt={player.runes[1][1].name + " icon"} className="w-[25px] h-[25px] rounded-full" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div key="items" className="flex flex-row gap-1 min-w-fit mt-3">
                                                        { itemsElements }
                                                    </div>
                                                </div>
                                                <div key="stats" className="min-w-min max-w-[70%]">
                                                    <div key="kda" className="min-w-fi max-w-fit">
                                                        <p className="text-lg font-bold inline">{player.kills}</p>
                                                        <p className="text-lg text-slate-50/20 inline"> / </p>
                                                        <p className="text-lg text-red-500 font-bold inline">{player.deaths}</p>
                                                        <p className="text-lg text-slate-50/20 inline"> / </p>
                                                        <p className="text-lg font-bold inline">{player.assists}</p>
                                                        <p className="text-slate-50/80">{KDA + ":1 KDA"}</p>
                                                        <p className="text-slate-50/80">{"CS " + CScore + " (" + CSPM + ")"}</p>
                                                        <p className="text-slate-50/80">{"Vision Score : " + VScore}</p>
                                                    </div>
                                                    <div key="achievments" className="flex flex-wrap justify-start w-full">
                                                        {multiKills
                                                        ?
                                                            <span key="multiKills" className="bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 text-slate-50 px-1 mr-1 my-1 rounded max-w-fit">{multiKills}</span>
                                                        :
                                                            <></>
                                                        }
                                                        {firstBlood
                                                        ?
                                                            <span key="firstBlood" className="bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 text-slate-50 px-1 mr-1 my-1 rounded max-w-fit">{firstBlood}</span>
                                                        :
                                                            <></>
                                                        }
                                                        {unkillable
                                                        ?
                                                            <span key="unkillable" className="bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 text-slate-50 px-1 mr-1 my-1 rounded max-w-fit">{unkillable}</span>
                                                        :
                                                            <></>
                                                        }
                                                        {farmer
                                                        ?
                                                            <span key="farmer" className="bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-700 text-slate-50 px-1 mr-1 my-1 rounded max-w-fit">{farmer}</span>
                                                        :
                                                            <></>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="min-w-[10%] xl:min-w-[5%]">
                                            </div>
                                        </div>
                                        <div key="players" className="flex flex-row justify-self-end align-self-end">
                                            <div key="team1" className="min-w-[170px]">
                                                {teams[100]}
                                            </div>
                                            <div key="team2" className="min-w-[170px]">
                                                {teams[200]}
                                            </div>
                                        </div>
                                    </div>
                                );
                                if(parseInt(i) === matches.length - 1) {
                                    console.log(matchesCards);
                                    setCards(matchesCards);
                                    setLoaded(true);
                                }
                            })
                            .catch((err) => console.log(err));
                        })
                        .catch((err) => console.log(err));
                    })
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
        }
    }

    useEffect(() => {
        setLoaded(false);
        setup();
    },[matches,info]);

    useEffect(() => {},[loaded])

    return(
        <div id="history" className="min-w-fit p-4 mt-4 rounded shadow-md backdrop-brightness-90">
            <h2 className="text-2xl text-center mb-3">Matches History</h2>
            {loaded
            ?
                cards
            :
                "Loading..."
            }
        </div>
    )
}