import React, {useEffect, useState} from 'react'
import { useTimer } from 'react-timer-hook';
import Welcome from './Welcome'
import Shoppies from './Shoppies'

function Main(){
    let expiryTimestamp;

    const [done, setDone] = useState(false)
    const doneHandler = () => {
        setDone(true)
        sessionStorage.setItem('visited', 'true')
    } 
    const time = new Date()
    time.setSeconds(time.getSeconds()+10)
    expiryTimestamp = time

    const {
        start,
      } = useTimer({ expiryTimestamp, onExpire: doneHandler });


    useEffect(() => {
        if (sessionStorage.getItem('visited')=== null) start()
        else doneHandler()
    }, [])

    return (
        <div>
            {done ? 
            <Shoppies />
            : 
            <Welcome />
            }
        </div>
    )
}

export default Main