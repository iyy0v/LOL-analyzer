

export default function AccCard({accInfo}) {

    return(
        <div className="w-11/12 h-18 p-1 py-3 flex flex-row gap-3 z-1">
            <div className="col-span-1 min-w-16 ">
                <img src={require("../img/profile.jpg")} alt="profile icon" className="w-16 rounded-2xl"/>
            </div>
            <div className="col-span-3 w-full">
                <p className="text-2xl">{accInfo.data.name}</p>
                <div className="flex flex-row justify-between gap-2 text-gray-400">
                    <p>lvl {accInfo.data.summonerLevel}</p>
                    <p>Bronze II - 72LP</p>
                </div>
            </div>
        </div>
    );
}