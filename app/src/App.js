import './style/index.css';
import NavBar from './components/NavBar';
import AccCard from './components/AccountCard';
import { useState } from 'react';

function App() {
  const [accInfo, setAccInfo] = useState('');
  const addAccount = (info) => {
    setAccInfo(info);
    console.log(info);
  }

  return (
    <div className="App h-screen bg-gradient-to-b from-slate-900 to-sky-900  text-gray-100 overflow-hidden">
      <NavBar addAcc={addAccount}/>
      <main className=" h-[100vh] flex divide-x divide-sky-900 z-1">
        <aside className="basis-1/4 pt-16">
          <div className="sticky h-[92vh] overflow-y-scroll overscroll-contain scrollbar pt-4 flex flex-col items-center top-16 divide-y divide-sky-900">
            <AccCard />
            <AccCard />
            <AccCard />
            <AccCard />
            <AccCard />
            <AccCard />
            <AccCard />
            <AccCard />
            <AccCard />
            <AccCard />
            <AccCard />
            <AccCard />
          </div>
        </aside>
        <div className="basis-3/4 pt-16 overflow-y-scroll scrollbar">
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
