import { useEffect, useState } from "react";
import axios from "axios";
import { filterRank,joinChampions,numberWithSpaces,toDateTime,getRegionName, getMatches } from "../scripts";
import Stats from './Stats';

export default function Dashboard(props) { 
    const [rank,setRank] = useState();
    const [mastery,setMastery] = useState();
    const [mains,setMains] = useState([]);
    
    const patch = props.props.patch;
    const account = props.props.currentAcc;
    const info = account.data;
    const region = props.props.region;
    const regionName = getRegionName(region);

    
    function render() {
        const API_KEY = process.env.REACT_APP_API_KEY;
        axios({
            url: "https://" + region + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + info.id + "?api_key=" + API_KEY,
            method: "GET"
        })
        .then((res) => {
            //Process Ranks
            let temp = filterRank(res);
            setRank(temp);
            axios({
                url: "https://" + region + ".api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/" + info.id + "?api_key=" + API_KEY,
                method: "GET"
            })
            .then((res1) => {
                fetch('http://ddragon.leagueoflegends.com/cdn/' + patch + '/data/en_US/champion.json')
                .then(res2 => res2.json()).then(champs => {
                    const mastery = joinChampions(res1,champs);
                    setMastery(mastery);

                    // Process main champions
                    let n;
                    if(mastery.length > 10) n = 10;
                    else n = mastery.length;

                    let temp;
                    temp = [];
                    setMains([]);
                    for(let i=0; i<n; i++) {  
                        temp.push(
                            <span id="main1" key={mastery[i].champion.name} className="flex flex-row w-[400px] min-w-max p-2 m-2 rounded shadow-md snap-start backdrop-brightness-90">
                                <img src={"http://ddragon.leagueoflegends.com/cdn/12.18.1/img/champion/" + mastery[i].champion.id + ".png"} alt={mastery[i].champion.name + " image"} className="w-[80px] h-[80px] rounded-xl"/>
                                <span className="mx-2">
                                    <h3 className="text-2xl text-yellow-600">{mastery[i].champion.name}</h3>
                                    <img src={"https://github.com/RiotAPI/Riot-Games-API-Developer-Assets/blob/master/champion-mastery-icons/mastery-" + mastery[i].championLevel + ".png?raw=true"} alt="mastery icon" className="w-[40px] inline" />
                                    <p className="inline text-xl mt-[5px] ml-[5px]">{numberWithSpaces(mastery[i].championPoints)}</p>
                                </span>
                                <span className="flex flex-col justify-end">
                                    <p className="text-sm text-gray-400">{"Last time played : " + toDateTime(mastery[i].lastPlayTime)}</p>
                                </span>
                            </span>
                        );
                    }
                    setMains(temp);
                })
                .catch(console.log);
            })
            .catch((err) => {console.log(err)});
        })
        .catch((err) => {console.log(err)});
    }

    
    function checkMMR() {
        let reg;
        switch(region) {
            case "euw1":
                reg = "euw";
                break;
            case "eun1":
                reg = "eune";
                break;
            case "na1":
                reg = "na";
                break;
            case "kr":
                reg = "kr";
                break;
            default:
                reg = "";
                break;
        }
        if(reg) {
            window.open("https://" + reg + ".whatismymmr.com/" + info.name);
        }
        else {
            const newMsg = document.createElement("p");
            newMsg.setAttribute("class","mx-4 mt-4 text-red-200");
            newMsg.textContent = "Unavailable for this region";
            const button = document.getElementById("mmrBtn");
            button.parentNode.replaceChild(newMsg,button);
        }
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
            : //Account selected
                <div id="dashboard" className="px-[10%] py-16 divide-y divide-slate-600">
                    <div id="accountInfos" className="flex flex-row justify-between w-full">
                        <div id="leftInfo"  className="flex flex-row">
                            <div>
                                <img src={"https://ddragon.leagueoflegends.com/cdn/" + patch + "/img/profileicon/" + info.profileIconId + ".png"} alt="profile icon" className="w-28 rounded-2xl"/>
                                <p className="w-min px-1 relative top-[-13px] mx-auto rounded bg-slate-900 ">{info.summonerLevel}</p>
                            </div>
                            <div>
                                <p className="w-fit px-4 py-2 text-5xl">{info.name} <sup className="text-sm align-super">({regionName})</sup></p>
                                <button id="mmrBtn" onClick={checkMMR} className="px-3 py-1 mx-4 mt-4 rounded bg-slate-600">View MMR</button>
                            </div>
                        </div>
                        <div id="rightInfo" className="flex flex-col justify-around mb-2">
                            <p className="text-gray-400">Ranked Solo : <strong>{rank !== undefined ? rank.solo !== undefined ? rank.solo.tier + " " + rank.solo.rank + " - " + rank.solo.leaguePoints + " LP" : "Unranked" : "Unranked"}</strong></p>
                            <p className="text-gray-400">Ranked Flex : <strong>{rank !== undefined ? rank.flex !== undefined ? rank.flex.tier + " " + rank.flex.rank + " - " + rank.flex.leaguePoints + " LP" : "Unranked" : "Unranked"}</strong></p>
                        </div>
                    </div>
                    <div id="accountStats">
                        <div id="mainChamps" className="flex flex-row my-2 overflow-x-auto scrollbar snap-x snap-normal ">
                            {mains.length > 0 ? mains : <p className="text-xl text-slate-600 pt-4 text-center">None</p>} 
                        </div>
                        <Stats props={{info ,region}}/>
                    </div>
                </div>
            }
        </>
    )
}