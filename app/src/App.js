import './style/index.css';
import NavBar from './components/NavBar';
import AccCard from './components/AccountCard';
import { useEffect, useState } from 'react';

function App() {
  const [patch, setPatch] = useState("");
  const [rerender, setRerender] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const addAccount = (info1,info2) => {
    const temp = accounts;
    temp.push(<AccCard accInfo={info1} rankInfo={info2} patch={patch} />);
    setAccounts(temp);
    setRerender(!rerender);
  }


  useEffect(() => {  },[rerender]);

  return (
    <div className="App h-screen bg-gradient-to-b from-slate-900 to-sky-900  text-gray-100 overflow-hidden">
      <NavBar addAcc={addAccount} setPatch={setPatch} />
      <main className=" h-[100vh] flex divide-x divide-sky-900 z-1">
        <aside className="basis-1/4 pt-16">
          <div className="sticky h-[92vh] overflow-y-auto overscroll-contain scrollbar pt-4 flex flex-col items-center top-16 divide-y divide-sky-900">
           { accounts } 
          </div>
        </aside>
        <div className="basis-3/4 pt-16 overflow-y-auto scrollbar">
          <p className="text-9xl">Hello  World</p>
          <p className="text-9xl">Hello  World</p>
          <p className="text-9xl">Hello  World</p>
          <p className="text-9xl">Hello  World</p>
          <p className="text-9xl">Hello  World</p>
          <p className="text-9xl">Hello  World</p>
          <p className="text-9xl">Hello  World</p>
          <p className="text-9xl">Hello  World</p>
          <p className="text-9xl">Hello  World</p>
          <p className="text-9xl">Hello  World</p>
          <p className="text-9xl">Hello  World</p>
        </div>
        
      </main>
    </div>
  );
}

export default App;
