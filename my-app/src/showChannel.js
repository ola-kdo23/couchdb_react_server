import React,{ useState, useEffect} from "react";
import {Link, useLocation} from 'react-router-dom';
import AllChannels from "./DisplayChannels";
import ChannelForm from "./addChannel";
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import axios from "axios";

function ShowChannels(){
    //so we want to fetch all the channels we've made so far and display them

    const [updateList, setUpdateList] = useState(false);
    const [users,setUsers]=useState([]); 
    const location = useLocation();
    const param=new URLSearchParams(location.search);
    const username = param.get("user") || "None" ;
    const isadmin = param.get("admin")||"None";  //now we can use this to set up special button for the admin.
    

    useEffect(() => {
        axios.get('http://0.0.0.0:3000/allusers')
            .then(res => {
                setUsers(res.data.userDocs || []);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);


    const handleAddQuestion = () => {
      setUpdateList(!updateList);
    };

    const handleUserDeletion=(userid)=>{
        console.log(userid);
        axios.delete(`http://0.0.0.0:3000/deleteuser/${userid}`)
        .then(res=>{
            axios.get('http://0.0.0.0:3000/allusers')
                .then(res => {
                    setUsers(res.data.userDocs || []); // Update with the latest data
                })
                .catch(error => console.error("Error fetching data:", error));
        })
        .catch(error => console.error("Error deleting data:", error))
    }
    return(
        
        <div>
            <h1>Welcome to the channels page!</h1>
            <Link to='/Landing'> <button className='Button' > Back</button> </Link>
            <div  className="Delete-container">
                {isadmin === 'true'? 
                <Dropdown  >
                <MenuButton className="Button">Delete User</MenuButton>
                <Menu>
                    {users.map((user, index) => (
                        <MenuItem key={index} onClick={()=>handleUserDeletion(user._id)} >{user.username} </MenuItem> 
                        
                    ))}
                </Menu>
                </Dropdown>
                : null}
            </div>
            <ChannelForm onAddChannel={handleAddQuestion} author={username} />
            <AllChannels key={updateList} author={username} admin={isadmin}/>
            
        </div>
        
        
    );
}
export default ShowChannels;