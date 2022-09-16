import './style/index.css';
import NavBar from './components/NavBar';
import AccCard from './components/AccountCard';

function App() {
  return (
    <div className="App h-full bg-gradient-to-b from-slate-900 to-sky-900  text-gray-100">
      <NavBar />
      <main className="flex pt-16 divide-x divide-sky-900">
        <aside className="basis-1/4">
          <div className="sticky pt-4 flex flex-col items-center top-16 divide-y divide-sky-900 gap-2">
            <AccCard />
            <AccCard />
            <AccCard />
          </div>
        </aside>
        <div className="basis-3/4">
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
