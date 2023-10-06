import axios from 'axios';
import { useState,useEffect } from 'react';
import { getResult , findSummoner , getRegionName2} from '../scripts';
import {Chart as ChartJS, ArcElement, Tooltip, RadialLinearScale, PointElement, LineElement} from 'chart.js'
import { Doughnut , Radar } from 'react-chartjs-2';
ChartJS.register(ArcElement, Tooltip, RadialLinearScale, PointElement, LineElement);


export default function Stats(props) {
    const [normalW, setNormalW] = useState(0);
    const [solo, setSolo] = useState({});
    const [flex, setFlex] = useState({});
    const [lanes,setLanes] = useState({'TOP':0,'JUNGLE':0,'MIDDLE':0,'BOTTOM':0,'UTILITY':0});
    const [loaded, setLoaded] = useState(false);
    const region = props.props.region;
    const info = props.props.info;
    const matches = props.props.matches;


    async function getMatchRes(regionName,matchID,API_KEY) {
        return axios({
            url: "https://" + regionName + ".api.riotgames.com/lol/match/v5/matches/" + matchID +"?api_key=" + API_KEY,
            method: "GET"
        })
        .then((match) => {
            return getResult(info.puuid,match);
        })
        .catch((err) => console.log(err));
    }

    async function getMatchRole(summoner,regionName,matchID,API_KEY) {
        return axios({
            url: "https://" + regionName + ".api.riotgames.com/lol/match/v5/matches/" + matchID +"?api_key=" + API_KEY,
            method: "GET"
        })
        .then((match) => {
            const player = findSummoner(summoner,match.data.info.participants);
            switch(player.lane) {
                case 'TOP':
                case 'JUNGLE':
                case 'MIDDLE':
                    return player.lane;
                case 'BOTTOM':
                    if(player.individualPosition === "BOTTOM") return player.lane;
                    else return player.individualPosition;
                default:
                    return player.individualPosition;
            }
        })
        .catch((err) => console.log(err));
    }


    function setup() {
        
        if(matches.status === 200 && matches.statusText === "OK" && matches.data[0] !== undefined) {
            const API_KEY = process.env.REACT_APP_API_KEY;
            let regionName = getRegionName2(region);
            setLoaded(false);
            
            axios({ // get normal games
                url: "https://" + regionName + ".api.riotgames.com/lol/match/v5/matches/by-puuid/" + info.puuid + "/ids?type=normal&start=0&count=20&api_key=" + API_KEY,
                method: "GET"
            })
            .then((matches) => {
                let wins = 0;
                for(let i in matches.data) {
                    getMatchRes(regionName,matches.data[i],API_KEY)
                    .then(result =>{
                        if(result) wins++;
                        setNormalW(wins);
                    });
                }
            })
            .catch((err) => console.log(err));

            axios({ // get ranked games
                url: "https://" + region + ".api.riotgames.com/lol/league/v4/entries/by-summoner/" + info.id +"?api_key=" + API_KEY,
                method: "GET"
            })
            .then((res) => {
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

            // get lanes
            const lanes = {};
            lanes['TOP'] = 0;
            lanes['JUNGLE'] = 0;
            lanes['MIDDLE'] = 0;
            lanes['BOTTOM'] = 0;
            lanes['UTILITY'] = 0;
            for(let i in matches.data) {
                getMatchRole(info.name,regionName,matches.data[i],API_KEY)
                .then((result) => {
                    lanes[result]++;
                    setLanes(lanes);
                });
                if(parseInt(i) === (matches.data.length - 1)) setLoaded(true);
            }
        }
    }

    useEffect(() => {
        setup();
    },[info,matches])
    useEffect(() =>{},[loaded]);

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
    const lanesData = {
        labels: ['Top', 'Middle', 'Bottom', 'Support', 'Jungle'],
        datasets: [{
            label: 'Matches played',
            data: [lanes['TOP'], lanes['MIDDLE'], lanes['BOTTOM'], lanes['UTILITY'], lanes['JUNGLE']],
            fill: true,
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            pointBackgroundColor: 'rgb(54, 162, 235)',
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: 'rgb(54, 162, 235)',
            pointBorderWidth: 2,
            pointHoverBorderWidth: 3,
            pointRadius: 5,
            pointHoverRadius: 6
        }]
    }
    const lanesOptions = {
        devicePixelRatio: 2, //enhance resolution
        scales: {
            r: {
                angleLines: {
                    display: true
                },
                ticks: {
                    backdropColor: 'rgba(0, 0, 0, 0)',
                    color: 'rgba(255, 255, 255, 0.3)',
                    font: {
                        size: 12
                    }
                },
                pointLabels: {
                    color: 'rgba(255, 255, 255, 0.3)',
                    font: {
                        size: 14
                    }
                },
                min: 0,
                suggestedMax: 1,
                backgroundColor: 'rgba(0, 0, 0, 0.08)'
            }
        }
    }

    return(
        <div id="stats" className="p-4 rounded shadow-md backdrop-brightness-90">
            { loaded
            ?
            <>
            <div id="ratios" className="flex flex-row justify-around min-h-max">
                <div id="normalRatio" className='min-h-max min-w-[200px]'>
                    <h2 className="text-xl text-center my-2">Normal</h2>
                    <Doughnut className='ratio' data={normalData} />
                    <p className='relative top-[-38%] right-[-38%] w-fit text-green-300'>W: {Math.round(normalW*100 / 20)}%</p>
                    <p className='relative top-[-38%] right-[-38%] w-fit text-red-300'>L : {Math.round((20-normalW)*100 / 20)}%</p>
                    <p className="text-center text-sm text-gray-500 relative bottom-8">Recent 20 Games Played</p>
                </div>
                <div id="soloRatio" className='min-h-max min-w-[200px]'>
                    <h2 className="text-xl text-center my-2">Ranked Solo</h2>
                    {solo.srW === 0 && solo.srL === 0
                    ?
                        <p className="text-center text-sm text-gray-500 pt-[50%]">No matches.</p>
                    :
                        <>
                        <Doughnut className='ratio' data={soloData}/>
                        <p className='relative top-[-38%] right-[-38%] w-fit text-green-300'>W: {Math.round(solo.srW*100 / (solo.srW+solo.srL))}%</p>
                        <p className='relative top-[-38%] right-[-38%] w-fit text-red-300'>L : {Math.round(solo.srL*100 / (solo.srW+solo.srL))}%</p>
                        </>
                    }
                </div>
                <div id="flexRatio" className='min-h-max min-w-[200px]'>
                    <h2 className="text-xl text-center my-2">Ranked Flex</h2>
                    {flex.frW === 0 && flex.frL === 0
                    ?
                        <p className="text-center text-sm text-gray-500 pt-[50%]">No matches.</p>
                    :   
                        <>
                        <Doughnut className='ratio' data={flexData}/>
                        <p className='relative top-[-38%] right-[-38%] w-fit text-green-300'>W: {Math.round(flex.frW*100 / (flex.frW+flex.frL))}%</p>
                        <p className='relative top-[-38%] right-[-38%] w-fit text-red-300'>L : {Math.round(flex.frL*100 / (flex.frW+flex.frL))}%</p>
                        </>
                    }
                </div>
            </div>
            <div id="lanes">
                <h2 className="text-2xl text-center mt-5">Lanes</h2>
                <Radar data={lanesData} options={lanesOptions} className="radar mx-auto"/>
                <p className="text-center text-sm text-gray-500 relative bottom-8">Recent 20 Games Played</p>
            </div>
            </>
            :
                "Loading..."
            }
        </div>
    );
}