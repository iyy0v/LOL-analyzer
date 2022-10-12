import axios from 'axios';
import { useState,useEffect } from 'react';
import { getResult } from '../scripts';
import {Chart as Chart, ArcElement, Tooltip, Legend} from 'chart.js'
import { Doughnut } from 'react-chartjs-2';
Chart.register(ArcElement, Tooltip);


export default function Stats(props) {
    const [normalW, setNormalW] = useState(0);
    const region = props.props.region;
    const info = props.props.info;

    const normalData = {
        labels: ['Losses','Wins'],
        datasets: [{
          label: 'Win/Loss ratio',
          backgroundColor: ['rgba(255, 99, 132, 0.5)','rgba(75, 192, 192, 0.5)'],
          borderColor: ['rgba(255, 99, 132, 0.8)','rgba(75, 192, 192, 0.8)'],
          hoverBorderColor: ['rgb(255, 99, 132)','rgb(65, 182, 182)'],
          hoverBorderWidth: 2,
          spacing: 0,
          data: [12,8],
        }]
    };
    const soloData = {
        labels: ['Losses','Wins'],
        datasets: [{
          label: 'Win/Loss ratio',
          backgroundColor: ['rgba(255, 99, 132, 0.5)','rgba(75, 192, 192, 0.5)'],
          borderColor: ['rgba(255, 99, 132, 0.8)','rgba(75, 192, 192, 0.8)'],
          hoverBorderColor: ['rgb(255, 99, 132)','rgb(65, 182, 182)'],
          hoverBorderWidth: 2,
          spacing: 0,
          data: [10,10],
        }]
    };
    const flexData = {
        labels: ['Losses','Wins'],
        datasets: [{
          label: 'Win/Loss ratio',
          backgroundColor: ['rgba(255, 99, 132, 0.5)','rgba(75, 192, 192, 0.5)'],
          borderColor: ['rgba(255, 99, 132, 0.8)','rgba(75, 192, 192, 0.8)'],
          hoverBorderColor: ['rgb(255, 99, 132)','rgb(65, 182, 182)'],
          hoverBorderWidth: 2,
          spacing: 0,
          data: [4,16],
        }]
    };

    function render() {
        const API_KEY = process.env.REACT_APP_API_KEY;
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
        
        axios({ // get normal games
            url: "https://" + regionName + ".api.riotgames.com/lol/match/v5/matches/by-puuid/" + info.puuid + "/ids?type=normal&api_key=" + API_KEY,
            method: "GET"
        })
        .then((matches) => {
            for(let i in matches.data) {
                axios({
                    url: "https://" + regionName + ".api.riotgames.com/lol/match/v5/matches/" + matches.data[i] +"?api_key=" + API_KEY,
                    method: "GET"
                })
                .then((match) => {
                    if(getResult(info.puuid,match)) setNormalW(normalW+1);
                })
                .catch((err) => console.log(err));
            }
            console.log(normalW);
        })
        .catch((err) => console.log(err));
    }

    useEffect(() =>{
        render();
    },[]);

    return(
        <div id="stats" className="p-4 rounded shadow-md backdrop-brightness-90">
            <div id="ratios"  className="flex flex-row justify-around">
                <div id="normalRatio" className='ratio'>
                    <h2 className="text-xl text-center my-2">Normal</h2>
                    <Doughnut id="ratio" data={normalData} />
                </div>
                <div id="soloRatio" className='ratio'>
                    <h2 className="text-xl text-center my-2">Solo ranked</h2>
                    <Doughnut id="ratio" data={soloData} />
                </div>
                <div id="flexRatio" className='ratio'>
                    <h2 className="text-xl text-center my-2">Flex ranked</h2>
                    <Doughnut id="ratio" data={flexData} />
                </div>
            </div>
            <p className="text-center text-sm text-gray-500 pt-12">Stats for the last 20 matches played in each mode</p>
        </div>
    );
}