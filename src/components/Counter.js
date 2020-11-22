import React, {useState, useEffect} from 'react'

const Counter = props => {
    const [number, setNumber] = useState(0)
    
    const [componentDidMount, setComponentDidMount] = useState(false)
    useEffect(() => {
        if (componentDidMount === false){
            console.log('component did mount')
            setComponentDidMount(true)
        }
        console.log('update')
    })
    return(
        <div>
            <p>{number}</p>
            <button
            onClick={() => setNumber(number + 1)}
            >+</button>
        </div>
    )
}

export default Counter