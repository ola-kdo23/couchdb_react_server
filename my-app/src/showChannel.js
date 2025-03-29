import React,{ useState} from "react";
import {Link} from 'react-router-dom';
import AllChannels from "./DisplayChannels";
import ChannelForm from "./addChannel";

function ShowChannels(){
    //so we want to fetch all the channels we've made so far and display them

    const [updateList, setUpdateList] = useState(false);

    const handleAddQuestion = () => {
      setUpdateList(!updateList);
    };

    return(
        
        <div>
            <p>Welcome to the channels page!</p>
            <Link to='/Landing'> <button> Back</button> </Link>
            <ChannelForm onAddChannel={handleAddQuestion} />
            <AllChannels key={updateList}/> 
        </div>
        
        
    );
}
export default ShowChannels;