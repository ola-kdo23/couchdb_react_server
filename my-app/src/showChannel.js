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
            <h1>Welcome to the channels page!</h1>
            <Link to='/Landing'> <button className='Button' > Back</button> </Link>
            <ChannelForm onAddChannel={handleAddQuestion} />
            <AllChannels key={updateList}/> 
        </div>
        
        
    );
}
export default ShowChannels;