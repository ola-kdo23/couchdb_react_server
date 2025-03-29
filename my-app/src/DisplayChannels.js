import React,{ useState, useEffect} from "react";
import axios from "axios";
const AllChannels= () => {

    const[chans,setChannels]=useState([]);

    useEffect(() => {
        axios.get('http://0.0.0.0:3000/alldata')
            .then(res => {
                // Ensure topics is always an array
                setChannels(res.data.docs || []);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    return(
        <div className="Channels-conatiner"> 
            {chans.length > 0 ? 
            (chans.map(c=>(
                <div key={c.id} className="channel-container">
                    <div className="channel-header">
                        <h3>Discussion on: {c.topic}</h3>
                        <p><em>Posted on: {c.date}</em></p>
                    </div>
                </div>
            )))
            :
            (
                <div>No channels have been made yet</div>
            )
        }
        </div>
    )
}
export default AllChannels;