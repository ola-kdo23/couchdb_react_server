import React,{ useState, useEffect} from "react";
import {Link, useLocation} from 'react-router-dom';
import AllChannels from "./DisplayChannels";
import ChannelForm from "./addChannel";
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import TextField from "@mui/material/TextField"
import axios from "axios";

function ShowChannels(){
    //so we want to fetch all the channels we've made so far and display them

    const [updateList, setUpdateList] = useState(false);
    const [users,setUsers]=useState([]); 
    const location = useLocation();
    const param=new URLSearchParams(location.search);
    const username = param.get("user") || "None" ;
    const isadmin = param.get("admin")||"None";  //now we can use this to set up special button for the admin.
    const[search,setSearch]=useState("");
    const [filteredChannels, setFilteredChannels] = useState([]);
    
    useEffect(() => {
        axios.get('http://0.0.0.0:3000/allusers')
            .then(res => {
                setUsers(res.data.userDocs || []);
            })
            .catch(error => console.error("Error fetching data:", error));

            axios
            .get("http://0.0.0.0:3000/alldata")
            .then((res) => {
                setFilteredChannels(res.data.docs || []); // Initially set all channels
                
            })
            .catch((error) => console.error("Error fetching data:", error));

    }, []);

    // Recursively search if searched string is in answers or nested replies
    const handleRecursiveAnswerSearch = (answer, searchLower) => {
        if (answer.answer.toLowerCase().includes(searchLower) || answer.author.toLowerCase().includes(searchLower)) {
            return true;
        }
        if (answer.replies && answer.replies.length > 0) {
            return answer.replies.some(reply => handleRecursiveAnswerSearch(reply, searchLower));
        }

        return false;
    };

    const handleSetSearch=(event)=>{
        const searchval =event.target.value;
        setSearch(searchval)

        if(searchval.trim !== "") { //if the search bar isnt empty

            //check if the searched string exists in any channel question or answer
            axios.get("http://0.0.0.0:3000/alldata")
            .then((res) => {
                const filtered = res.data.docs.filter((channel) => {
                    const searchLower = searchval.toLowerCase();

                    // Check if channel topic or author matches
                    if (channel.topic.toLowerCase().includes(searchLower)|| channel.author.toLowerCase().includes(searchLower)) {
                        return true;
                    }

                    // Check if question's or their author's match
                    const questionsMatch = channel.questions.some((question) =>
                        question.question.toLowerCase().includes(searchLower)
                    );
                    const questionUserMatch =channel.questions.some((question) =>
                        question.author.toLowerCase().includes(searchLower)
                    );

                    // Check if answers or their authors match...needs recursion becuase they have nested replies
                    const answersMatch = channel.questions.some((question) =>
                        question.answers.some((answer) =>
                            handleRecursiveAnswerSearch(answer, searchLower)
                        )
                    );

                    

                    return questionsMatch || answersMatch || questionUserMatch;
                });

                setFilteredChannels(filtered);
            })
            .catch((error) => console.error("Error fetching data:", error));

        }
    }
    //handle getting the user with the most and least posts
    const handleMostPosts = () => {
        axios.get('http://0.0.0.0:3000/mostposts')
            .then(res => {
                alert(`User with most posts: ${res.data.username} with ${res.data.numOfposts} posts`);
            })
            .catch(error => console.error("Error fetching most posts", error));
    };
    
    const handleLeastPosts = () => {
        axios.get('http://0.0.0.0:3000/leastposts')
            .then(res => {
                alert(`User with least posts: ${res.data.username} with ${res.data.numOfposts} posts`);
            })
            .catch(error => console.error("Error fetching least posts", error));
    };
    
    //allows the admin to delete users
    const handleUserDeletion=(userid)=>{
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

    //handles adding questions into a channel
    const handleAddQuestion = () => {
        setUpdateList(!updateList);
      };
  
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
            <TextField variant="outlined" fullWidth label="Search" onChange={handleSetSearch}/>
            <div>  {/*allows searching */}
                <div>
                <label>Who has the most posts? </label> <button className="Button" onClick={handleMostPosts}>Find out</button>
                </div>
                <br/>

                <div>
                <label>Who has the least posts?</label> <button className="Button" onClick={handleLeastPosts}>Find out</button>
                </div>
                <br/>

            </div>
            <ChannelForm onAddChannel={handleAddQuestion} author={username} />
            <AllChannels key={updateList} author={username} admin={isadmin} channels={filteredChannels}/>
            
        </div>
        
        
    );
}
export default ShowChannels;