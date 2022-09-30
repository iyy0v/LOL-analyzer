import { useEffect, useState } from "react";
import axios from "axios";
import { filterRank } from "../scripts";

export default function Dashboard(props) { 
    const [patch, setPatch] = useState("");
    const [rank,setRank] = useState();

    fetch('https://ddragon.leagueoflegends.com/api/versions.json')
    .then(res => res.json()).then(result => setPatch(result[0]))
    .catch(console.log);
    
    const account = props.props.currentAcc;
    const region = props.props.region;
    const info = account.data;

    
    function render() {
        const API_KEY = process.env.REACT_APP_API_KEY;
        axios({
            url: "https://" + region + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + info.id + "?api_key=" + API_KEY,
            method: "GET"
        })
        .then((res) => {
            const temp = filterRank(res);
            setRank(temp);
        })
        .catch((err) => {console.log(err)});
    }

    useEffect(() =>{
        if(info !== undefined && (typeof region) === "string") render();
    },[info,region]);
    
    return(
        <>
            {info === undefined ? 
                <div id="dashboard" className="pt-4">
                    <p className="text-xl text-slate-600 pt-4 text-center">No account selected.</p>
                </div>
            :
                <div id="dashboard" className="px-[10%] py-16">
                    <div id="accountInfos" className="flex flex-row justify-between w-full">
                        <div id="rightInfo"  className="flex flex-row">
                            <div>
                                <img src={"https://ddragon.leagueoflegends.com/cdn/" + patch + "/img/profileicon/" + info.profileIconId + ".png"} alt="profile icon" className="w-28 rounded-2xl"/>
                                <p className="w-min px-1 relative top-[-13px] mx-auto rounded bg-slate-900 ">{info.summonerLevel}</p>
                            </div>
                            <p className="w-fit px-4 py-2 text-5xl">{info.name}</p>
                        </div>
                        <div id="leftInfo" className="flex flex-col justify-around">
                            <p className="py-2 text-gray-400">Ranked Solo : <strong>{rank !== undefined ? rank.solo !== undefined ? rank.solo.tier + " " + rank.solo.rank + " - " + rank.solo.leaguePoints + " LP" : "Unranked" : "Unranked"}</strong></p>
                            <p className="py-2 text-gray-400">Ranked Flex : <strong>{rank !== undefined ? rank.flex !== undefined ? rank.flex.tier + " " + rank.flex.rank + " - " + rank.flex.leaguePoints + " LP" : "Unranked" : "Unranked"}</strong></p>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}