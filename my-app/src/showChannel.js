import React from "react";
import {Link} from 'react-router-dom';

function ShowChannels(){
    return(
        <header>
            <div>
                <p>Welcome to the channels page!</p>
                <Link to='/Landing'> <button> Back</button> </Link>      
            </div>
        </header>
        
    );
}
export default ShowChannels;