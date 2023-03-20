import axios from 'axios';
import { getRegionName } from '../scripts';


export default function NavBar(props) {
    const API_KEY = process.env.REACT_APP_API_KEY;
    let regions = [<option key="euw" value="euw1">EUW</option>,<option key="eun" value="eun1">EUNE</option>,<option key="na" value="na1">NA</option>,<option key="kr" value="kr">KR</option>,<option key="oce" value="oc1">OCE</option>,<option key="jp" value="jp1">JP</option>,<option key="br" value="br1">BR</option>,<option key="lan" value="la1">LAN</option>,<option key="las" value="la2">LAS</option>,<option key="ru" value="ru">RU</option>,<option key="tr" value="tr1">TR</option>];

    function handleGet(event) {
        const summoner = event.target.value;
        const region = document.getElementById("region").value;
        const regionName = getRegionName(region);
        if(event.key === 'Enter') {
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
            .catch((err) => {console.log(err)});

            event.target.value = "";
        }
    };
    
    return (
        <nav id="navbar" className="fixed flex flex-row flex-nowrap justify-between items-center z-10 w-full h-16 pr-4 pl-4 backdrop-blur-md shadow-sm shadow-slate-800">
            <div>
                <img src={require("../img/logo.png")} alt="logo" className='w-36' />
            </div>
            <div>
                <select id="region" className="h-10 p-2 rounded-l outline-none bg-slate-200 text-gray-900 font-bold">
                    {regions}
                </select>
                <input type="text" placeholder="Summoner name here" onKeyPress={handleGet} className="w-64 h-10 p-2 rounded-r outline-none text-gray-900 font-medium"/>
            </div>
            <div>
                <a href="https://github.com/iyy0v/LOL-analyzer/" target="_blank" rel="noreferrer">
                    <span className="icon"></span>
                </a>
            </div>
        </nav>
    );
}