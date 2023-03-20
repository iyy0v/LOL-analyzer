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
  const [region, setRegion] = useState('');

  fetch('https://ddragon.leagueoflegends.com/api/versions.json')
  .then(res => res.json()).then(result => setPatch(result[0]))
  .catch(console.log);

  const addAccount = (info1,info2,region,regionName) => {
    const temp = accounts;
    temp.push(<AccCard key={info1.data.id} accInfo={info1} rankInfo={info2} region={region} regionName={regionName} patch={patch} loadAcc={loadAccount}/>);
    setAccounts(temp);
    setRerender(current => !current);
  }

  const loadAccount = (accInfo,region) => {
    const temp = accInfo;
    setCurrentAcc(temp);
    const temp2 = region;
    setRegion(temp2);
    setRerender(current => !current);
  }

  function handleClear() {
    let temp;
    temp = [];
    setAccounts(temp);
    temp = undefined;
    setCurrentAcc(temp);
    setRegion(temp);
  }


  useEffect(() => {  },[rerender,accounts]);

  return (
    <div className="App h-screen bg-gradient-to-b from-slate-900 to-sky-900  text-gray-100 overflow-hidden">
      <NavBar props={{addAccount,loadAccount}} />
      <main className=" h-[100vh] flex divide-x divide-sky-900 z-1">
        <aside className="lg:basis-1/4 pt-16 lg:block hidden basis-0">
          <div className="sticky h-[100%] overflow-y-auto overscroll-contain scrollbar pt-4 flex flex-col items-center top-16 divide-y divide-sky-900 min-w-[300px]">
            { accounts.length === 0 ? 
              <p className="text-xl text-slate-600 pt-4">No accounts added.</p> 
            : 
              [
                ...accounts,
                <div id="clearBtn" key="clearBtn" onClick={handleClear} className="sticky flex flex-row justify-center w-[95%] top-full py-2 my-2 mx-auto ml-auto rounded bg-red-600 clickable">
                  <span className="material-symbols-outlined ">delete</span>
                </div>
              ]
            }
          </div>
        </aside>
        <div className="lg:basis-3/4 basis-full pt-16 overflow-y-auto scrollbar">
          { currentAcc ?
              <Dashboard props={{currentAcc , region , patch}}/>
            :
              <div id="dashboard" className="pt-4">
                <p className="text-xl text-slate-600 pt-4 text-center">No account selected.</p>
              </div>
          }
          
        </div>
      </main>
    </div>
  );
}

export default App;
