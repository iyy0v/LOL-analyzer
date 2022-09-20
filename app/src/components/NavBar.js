import axios from 'axios';

export default function NavBar({addAcc}) {
    
    const API_KEY = "RGAPI-e2792f24-186c-4da9-a6cb-ef801611bc3c";
    let regions = [<option value="euw1">EUW</option>,<option value="eun1">EUNE</option>,<option value="na1">NA</option>,<option value="kr">KR</option>,<option value="oc1">OCE</option>,<option value="jp1">JP</option>,<option value="br1">BR</option>,<option value="la1">LAN</option>,<option value="la2">LAS</option>,<option value="ru">RU</option>,<option value="tr1">TR</option>];


    function handleGet(event) {
        const summoner = event.target.value;
        const region = document.getElementById("region").value;
        if(event.key === 'Enter') {
            axios({
              // Endpoint to send files
              url: "https://" + region + ".api.riotgames.com/lol/summoner/v4/summoners/by-name/" + summoner + "?api_key=" + API_KEY,
              method: "GET"
            })
            .then((res1) => {
                axios({
                url: "https://" + region + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + res1.data.id + "?api_key=" + API_KEY,
                method: "GET"
                })
                .then((res2) => {
                    addAcc(res1,res2);
                })
                .catch((err) => { 
                    console.log(err)
                });
            })
          
            .catch((err) => { 
                console.log(err)
            });


            
            event.target.value = "";
        }
    };
    
    return (
        <nav className="fixed flex flex-row flex-nowrap justify-between items-center z-10 w-full h-16 pr-4 pl-4 backdrop-blur-md shadow-sm shadow-slate-800">
            <div>LEFT SIDE</div>
            <div>
                <select id="region" className="h-10 p-2 rounded-l outline-none bg-slate-200 text-gray-900 font-bold">
                    {regions}
                </select>
                <input type="text" placeholder="Summoner name here" onKeyPress={handleGet} className="h-10 p-2 rounded-r outline-none text-gray-900 font-medium"/>
            </div>
            <div>RIGHT SIDE</div>
        </nav>
    );
}