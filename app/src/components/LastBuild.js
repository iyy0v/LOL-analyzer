import { useState } from "react";
import axios from "axios";
import { findSummoner } from "../scripts";

export default function LastBuild(props) {
    const [live,setLive] = useState(false);

    async function spectate() {
        const API_KEY = process.env.REACT_APP_API_KEY;
        const info = props.props.info;
        const region = props.props.region;

        let regionName;
        switch(region) {
            case "euw1":
            case "eun1":
            case "ru":
            case "tr1":
                regionName = "europe";
                break;
            case "na1":
            case "la1":
            case "la2":
            case "br1":
                regionName = "americas";
                break;
            case "kr":
            case "jp1":
                regionName = "asia";
                break;
            default:
                regionName = "sea";
                break;
        }

        axios({
            url: "https://" + region + ".api.riotgames.com/lol/spectator/v4/active-games/by-summoner/" + info.id + "?api_key=" + API_KEY,
            method: "GET"
        })
        .then((match) => {
            const player = findSummoner(info.name,match.data.participants);

            axios({
                url: "https://" + region + ".api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + info.id + "/by-champion/" + player.championId + "?api_key=" + API_KEY,
                method: "GET"
            })
            .then((champion) => {
                axios({
                    url: "https://" + regionName + ".api.riotgames.com/lol/match/v5/matches/by-puuid/" + info.puuid + "/ids?endTime=" + champion.data.lastPlayTime +"&count=1&api_key=" + API_KEY,
                    method: "GET"
                })
                .then((matchId) => {
                    axios({
                        url: "https://" + regionName + ".api.riotgames.com/lol/match/v5/matches/" + matchId.data[0] + "?api_key=" + API_KEY,
                        method: "GET"
                    })
                    .then((match) => {
                        console.log("Last Build :");
                        console.log(match);
                    })
                    .catch((err) => console.log(err));
                })
                .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));

            setLive(true);
        })
        .catch((err) => console.log(err));
    }

    spectate(); 
    return(
        <div id="LastBuild" className="p-4 mt-4 rounded shadow-md backdrop-brightness-90">
            <h2 className="text-2xl text-center mb-3">Last time played</h2>
            {live 
            ?
                <p>Playing.</p>
            :
                <p>Not playing.</p>
            }
        </div>
    )
}