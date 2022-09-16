import './style/index.css';
import NavBar from './components/NavBar';

function App() {
  return (
    <div className="App h-full bg-gradient-to-br from-slate-900 to-sky-900">
      <NavBar />
      <main className="flex pt-16">
        <aside className="basis-1/4">
          <div className="sticky top-16">
            <p className="text-6xl">Hello  World</p>
            <p className="text-6xl">Hello  World</p>
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
