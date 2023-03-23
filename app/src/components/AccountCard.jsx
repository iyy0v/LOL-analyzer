
export default function AccCard({accInfo,rankInfo,region,regionName,patch,loadAcc}) {
    // Init account infos
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
            type = "Solo";
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
        loadAcc(accInfo,region);
    }    
    

    // Component 
    return(
        <div onClick={loadAccount} className="w-[98%] h-18 px-2 py-3 flex flex-row gap-3 z-1 rounded cursor-pointer hover:bg-slate-900 ">
            <div className="col-span-1 min-w-16 ">
                <img src={iconURL} alt="profile icon" className="w-16 rounded-2xl"/>
            </div>
            <div className="col-span-3 w-full">
                <div className="flex flex-row justify-between gap-2">
                    <p className="text-2xl">{name}</p>
                    <p className="text-sm">{regionName}</p>
                </div>
                
                <div className="flex flex-row justify-between gap-2 text-gray-400">
                    <p>lvl {level}</p>
                    <p>{tier} {rankedData ? <>{rank} - {lp}LP <small>({type})</small></> : "Unranked"}</p>
                </div>
            </div>
        </div>
    );
}