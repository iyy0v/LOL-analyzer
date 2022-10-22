import axios from 'axios';
import { useState,useEffect } from 'react';
import { getResult } from '../scripts';
import {Chart as Chart, ArcElement, Tooltip, Legend} from 'chart.js'
import { Doughnut } from 'react-chartjs-2';
Chart.register(ArcElement, Tooltip);


export default function Stats(props) {
    const [old,setOld] = useState(undefined);
    const [normalW, setNormalW] = useState(0);
    const [rankedW, setRankedW] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const region = props.props.region;
    const info = props.props.info;


    async function getMatchRes(regionName,matchID,API_KEY) {
        return axios({
            url: "https://" + regionName + ".api.riotgames.com/lol/match/v5/matches/" + matchID +"?api_key=" + API_KEY,
            method: "GET"
        })
        .then((match) => {
            console.log(match);
            return getResult(info.puuid,match);
        })
        .catch((err) => console.log(err));
    }

    if(info != old) {
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
        setLoaded(false);
        setOld(info);
        
        axios({ // get normal games
            url: "https://" + regionName + ".api.riotgames.com/lol/match/v5/matches/by-puuid/" + info.puuid + "/ids?type=normal&start=0&count=20&api_key=" + API_KEY,
            method: "GET"
        })
        .then((matches) => {
            let wins = 0;
            for(let i in matches.data) {
                setTimeout(() => {
                    getMatchRes(regionName,matches.data[i],API_KEY)
                    .then(result =>{
                        if(result) wins++;
                        setNormalW(wins);
                    });
                },i*100);
            }

            setTimeout(() =>{setLoaded(true)},2000);  
        })
        .catch((err) => console.log(err));

        axios({ // get ranked games
            url: "https://" + regionName + ".api.riotgames.com/lol/match/v5/matches/by-puuid/" + info.puuid + "/ids?type=ranked&start=0&count=20&api_key=" + API_KEY,
            method: "GET"
        })
        .then((matches) => {
            console.log(matches);
            let wins = 0;
            for(let i in matches.data) {
                setTimeout(() => {
                    getMatchRes(regionName,matches.data[i],API_KEY)
                    .then(result =>{
                        if(result) wins++;
                        console.log(wins);
                    });
                },i*100);
            }

            setTimeout(() =>{setLoaded(true)},2000);  
        })
        .catch((err) => console.log(err));
        console.log("render");
    }
    

    function display() {
        if(loaded) {
            return (<>
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
        </>);
        }
        else {
            return "Loading...";
        }
    }

    useEffect(() =>{
        display();
    },[info,loaded]);

    const normalData = {
        labels: ['Losses','Wins'],
        datasets: [{
          label: 'Win/Loss ratio',
          backgroundColor: ['rgba(255, 99, 132, 0.5)','rgba(75, 192, 192, 0.5)'],
          borderColor: ['rgba(255, 99, 132, 0.8)','rgba(75, 192, 192, 0.8)'],
          hoverBorderColor: ['rgb(255, 99, 132)','rgb(65, 182, 182)'],
          hoverBorderWidth: 2,
          spacing: 0,
          data: [20 - normalW,normalW],
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
          data: [20 - rankedW,rankedW],
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

    return(
        <div id="stats" className="p-4 rounded shadow-md backdrop-brightness-90">
            { display() }
        </div>
    );
}