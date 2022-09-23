import { useEffect } from "react"

export default function Dashboard(account) {
    const info = account.account;



    useEffect(() => {  },[account]);
    
    return(
        <div>
            {info === undefined ? <p>EMPTY</p> : 
            <p>{info.name}</p>
            }
            
        </div>
    )
}