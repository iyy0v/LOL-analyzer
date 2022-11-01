import { useEffect, useState } from "react";
import axios from "axios";
import { getRegionName2 } from "../scripts";

export default function History(props) {
    const [loaded,setLoaded] = useState(false);
    const [results,setResults] = useState([]);

    const info = props.props.info;
    const region = props.props.region;
    const matches = props.props.matches.data;

    function setup() {
        const API_KEY = process.env.REACT_APP_API_KEY;
        let regionName = getRegionName2(region);

        console.log(matches);
        for(let i in matches) {
            console.log(matches[i]);
            setTimeout(() => {
                axios({
                    url: "https://" + regionName + ".api.riotgames.com/lol/match/v5/matches/" + matches[i] +"?api_key=" + API_KEY,
                    method: "GET"
                })
                .then((res) => {
                    const match = res.data.info;
                    console.log(match);
                })
                .catch((err) => console.log(err));
            },110);
        }
    }

    setup();

    return(
        <div id="history" className="p-4 mt-4 rounded shadow-md backdrop-brightness-90">
            <h2 className="text-2xl text-center mb-3">Matches History</h2>
        </div>
    )
}