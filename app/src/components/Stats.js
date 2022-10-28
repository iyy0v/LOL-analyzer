import axios from 'axios';
import { useState,useEffect } from 'react';
import { getResult } from '../scripts';
import {Chart as Chart, ArcElement, Tooltip, Legend} from 'chart.js'
import { Doughnut } from 'react-chartjs-2';
Chart.register(ArcElement, Tooltip);


export default function Stats(props) {
    const [old,setOld] = useState(undefined);
    const [normalW, setNormalW] = useState(0);
    const [solo, setSolo] = useState({});
    const [flex, setFlex] = useState({});
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

        console.log(info);
        axios({ // get ranked games
            url: "https://" + region + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + info.id +"?api_key=" + API_KEY,
            method: "GET"
        })
        .then((res) => {
            console.log(res);
            let srW, srL, frW, frL;
            for(let i in res.data) {
                if(res.data[i].queueType === 'RANKED_SOLO_5x5') {
                    srW = res.data[i].wins;
                    srL = res.data[i].losses;
                }
                if(res.data[i].queueType === 'RANKED_FLEX_SR') {
                    frW = res.data[i].wins;
                    frL = res.data[i].losses;
                }
            }
            if(srW === undefined) {
                srW = 0;
                srL = 0;
            }
            if(frW === undefined) {
                frW = 0;
                frL = 0;
            }
            setSolo({srW,srL});
            setFlex({frW,frL});
        })
        .catch((err) => console.log(err));
        console.log("render");
    }
    

    function display() {
        if(loaded) {
            return (<>
            <div id="ratios" className="flex flex-row justify-around min-h-max">
                <div id="normalRatio" className='min-h-max'>
                    <h2 className="text-xl text-center my-2">Normal</h2>
                    <Doughnut className='ratio' data={normalData} />
                    <p className='z-99 relative top-[-38%] right-[-38%] text-green-300'>W: {Math.round(normalW*100 / 20)}%</p>
                    <p className='z-99 relative top-[-38%] right-[-38%] text-red-300'>L : {Math.round((20-normalW)*100 / 20)}%</p>
                    <p className="text-center text-sm text-gray-500 relative bottom-8">Last 20 matches played</p>
                </div>
                <div id="soloRatio" className='min-h-max'>
                    <h2 className="text-xl text-center my-2">Solo ranked</h2>
                    {solo.srW === 0 && solo.srL === 0
                    ?
                        <p className="text-center text-sm text-gray-500 pt-[50%]">No matches.</p>
                    :
                        <>
                        <Doughnut className='ratio' data={soloData} />
                        <p className='z-99 relative top-[-38%] right-[-38%] text-green-300'>W: {Math.round(solo.srW*100 / (solo.srW+solo.srL))}%</p>
                        <p className='z-99 relative top-[-38%] right-[-38%] text-red-300'>L : {Math.round(solo.srL*100 / (solo.srW+solo.srL))}%</p>
                        </>
                    }
                </div>
                <div id="flexRatio" className='min-h-max'>
                    <h2 className="text-xl text-center my-2">Flex ranked</h2>
                    {flex.frW === 0 && flex.frL === 0
                    ?
                        <p className="text-center text-sm text-gray-500 pt-[50%]">No matches.</p>
                    :   
                        <>
                        <Doughnut className='ratio z-1' data={flexData} />
                        <p className='z-99 relative top-[-38%] right-[-38%] text-green-300'>W: {Math.round(flex.frW*100 / (flex.frW+flex.frL))}%</p>
                        <p className='z-99 relative top-[-38%] right-[-38%] text-red-300'>L : {Math.round(flex.frL*100 / (flex.frW+flex.frL))}%</p>
                        </>
                    }
                </div>
            </div>
            
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
          data: [solo.srL,solo.srW],
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
          data: [flex.frL,flex.frW],
        }]
    };

    return(
        <div id="stats" className="p-4 rounded shadow-md backdrop-brightness-90">
            { display() }
        </div>
    );
}