

export default function ErrorCard() {

    return (
        <div id="ErrorCard" className="fixed bottom-4 right-4 px-6 py-5 bg-slate-300 rounded-lg hidden">
            <p id="ErrorTitle" className="text-red-600 text-2xl font-semibold"></p>
            <p id="ErrorMsg" className="text-gray-900 text-lg"></p>
        </div>
    )
}