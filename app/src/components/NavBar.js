
export default function NavBar() {
    let regions = [<option value="">EUW</option>,<option value="">EUNE</option>,<option value="">NA</option>,<option value="">KR</option>,<option value="">OCE</option>,<option value="">JP</option>,<option value="">BR</option>,<option value="">LAS</option>,<option value="">LAN</option>,<option value="">RU</option>,<option value="">TR</option>]

    return (
        <nav className="fixed flex flex-row flex-nowrap justify-between items-center z-10 w-full h-16 pr-4 pl-4 backdrop-blur-md shadow-sm shadow-slate-800">
            <div>LEFT SIDE</div>
            <div>
                <select className="h-10 p-2 rounded-l outline-none bg-slate-200 text-gray-900 font-bold">
                    {regions}
                </select>
                <input type="text" placeholder="Summoner name here" className="h-10 p-2 rounded-r outline-none text-gray-900 font-medium"/>
            </div>
            <div>RIGHT</div>
        </nav>
    );
}