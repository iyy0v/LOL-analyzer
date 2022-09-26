import { useState,useEffect } from "react"
import { getRank } from '../scripts'

export default function Dashboard(props) { 
    const [patch, setPatch] = useState("");

    fetch('https://ddragon.leagueoflegends.com/api/versions.json')
    .then(res => res.json()).then(result => setPatch(result[0]))
    .catch(console.log);
    
    const account = props.props.currentAcc;
    const region = props.props.region;
    const info = account.data;

    let rank;
    if(info !== undefined && (typeof region) === "string") {
        rank  = getRank(info.id,region);
        while(rank === undefined) { console.log(rank); }
        console.log(rank);
    }

    useEffect(() => { 

    
    },[account]);
    
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
                        <div id="leftInfo" className="my-auto">
                            <p className="py-2 text-gray-400">Ranked Solo : </p>
                            <p className="py-2 text-gray-400">Ranked Flex : </p>
                            <p className="py-2 text-gray-400">Ranked TFT : </p>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}