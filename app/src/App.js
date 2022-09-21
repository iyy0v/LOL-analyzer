import './style/index.css';
import NavBar from './components/NavBar';
import AccCard from './components/AccountCard';
import Dashboard from './components/Dashboard';
import { useEffect, useState } from 'react';

function App() {
  const [patch, setPatch] = useState("");
  const [currentAcc, setCurrentAcc] = useState({});
  const [rerender, setRerender] = useState(false);
  const [accounts, setAccounts] = useState([]);

  fetch('https://ddragon.leagueoflegends.com/api/versions.json')
  .then(res => res.json()).then(result => setPatch(result[0]))
  .catch(console.log);

  const addAccount = (info1,info2,region) => {
    const temp = accounts;
    temp.push(<AccCard key={info1.data.id} accInfo={info1} rankInfo={info2} region={region} patch={patch} setCurAcc={setCurrentAcc} rerender={rerender} setRerender={setRerender} loadAcc={loadAccount}/>);
    setAccounts(temp);
    setRerender(!rerender);
  }
  const loadAccount = (accInfo) => {
    console.log(currentAcc);
    setCurrentAcc(accInfo.data);
    console.log(currentAcc);
    //getMatches(region,accInfo.data.puuid,0,10);
    setRerender(!rerender);
  }


  useEffect(() => {  },[rerender]);

  return (
    <div className="App h-screen bg-gradient-to-b from-slate-900 to-sky-900  text-gray-100 overflow-hidden">
      <NavBar addAcc={addAccount} />
      <main className=" h-[100vh] flex divide-x divide-sky-900 z-1">
        <aside className="basis-1/4 pt-16">
          <div className="sticky h-[92vh] overflow-y-auto overscroll-contain scrollbar pt-4 flex flex-col items-center top-16 divide-y divide-sky-900">
           { accounts } 
          </div>
        </aside>
        <div className="basis-3/4 pt-16 overflow-y-auto scrollbar">
          <Dashboard />
        </div>
      </main>
    </div>
  );
}

export default App;
