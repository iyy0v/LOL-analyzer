import { useEffect, useState } from "react";
import axios from "axios";
import { getRegionName2 } from "../scripts";

export default function History(props) {
    const [loaded,setLoaded] = useState(false);
    const [results,setResults] = useState([]);
    const [team1,setTeam1] = useState([]);
    const [team2,setTeam2] = useState([]);

    const info = props.props.info;
    const region = props.props.region;
    const matches = props.props.matches.data;

    function setup() {
        const API_KEY = process.env.REACT_APP_API_KEY;
        let regionName = getRegionName2(region);

        console.log(matches);
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
                    const players = match.participants;
                    const teams = {100:[],200:[]};
                    for(let j in players) {
                        // add players to the card
                        if(players[j].summonerId === info.id) {
                            player = players[j];
                            // + add bold name
                            teams[player.teamId].push("YOU !");
                        }
                        else {
                            // add others
                            teams[players[j].teamId].push(players[j].summonerName);
                        }
                    }
                    setTeam1(teams[100]);
                    setTeam2(teams[200]);
                    console.log(teams);


                })
                .catch((err) => console.log(err));
            },110);
        }


        setTimeout(() => {
            setLoaded(true);
        },3000);
    }
    useEffect(() => {
        setup();
    },[]);

    return(
        <div id="history" className="p-4 mt-4 rounded shadow-md backdrop-brightness-90">
            <h2 className="text-2xl text-center mb-3">Matches History</h2>
        </div>
    )
}