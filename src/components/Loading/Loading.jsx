import React from 'react'
import Spinner from '../../assets/spinner.gif'

function Loading({size, msg}) {

    let width = "150px"
    let height = "150px"
    if(size) {
        switch (size) {
            case 1:
                width = "200px"
                height = "200px"
                break;
            case 2:
                width = "100px"
                height = "100px"
                break;
            case 3:
                width = "75px"
                height = "75px"
                break;
            case 4:
                width = "50px"
                height = "50px"
                break;
            case 5:
                width = "25px"
                height = "25px"   
                break; 
            default:
                break;
        }
    }

    return (
        <div>
            <img src={Spinner} alt="loading..." width={width} height={height}/>
            <br/>
            {msg}
        </div>
    )
}

export default Loading
