import { useEffect } from "react"

export default function Dashboard(account) {
    const info = account.account;


    useEffect(() => {  },[account]);
    
    return(
        <>
            {info === undefined ? 
                <p>EMPTY</p>
            :
                <div>
                    <h1 className="text-5xl">{info.name}</h1>
                    <h1 className="text-5xl">{info.name}</h1>
                    <h1 className="text-5xl">{info.name}</h1>
                    <h1 className="text-5xl">{info.name}</h1>
                    <h1 className="text-5xl">{info.name}</h1>
                    <h1 className="text-5xl">{info.name}</h1>
                    <h1 className="text-5xl">{info.name}</h1>
                    <h1 className="text-5xl">{info.name}</h1>
                    <h1 className="text-5xl">{info.name}</h1>
                    <h1 className="text-5xl">{info.name}</h1>
                    <h1 className="text-5xl">{info.name}</h1>
                    <h1 className="text-5xl">{info.name}</h1>
                    <h1 className="text-5xl">{info.name}</h1>
                    <h1 className="text-5xl">{info.name}</h1>
                    <h1 className="text-5xl">{info.name}</h1>
                    <h1 className="text-5xl">{info.name}</h1>
                    <h1 className="text-5xl">{info.name}</h1>
                </div>
            }
        </>
    )
}