import React,{ useState,useEffect} from "react";
import axios from "axios";
import {Button, Dialog, DialogContent, DialogTitle, TextField} from '@mui/material';

const LoginDialog=({ open, handleClose, onLogin})=>{
    //store the user name and password
    const[username, setUser]=useState('');
    const[password,setPass]=useState('');
    const[userDocs,setallUsers]=useState([]);
    const[error,setError]=useState('');

    //get all the user docs
    useEffect(() => {
        axios.get('http://0.0.0.0:3000/allusers')
            .then(res => {
                // store all the users 
                setallUsers(res.data.userDocs || []);
            })
            .catch(error => console.error("Error fetching user data:", error));
    }, []);


    const handleCloseD=()=>{   //reset the values after 
        setPass('');
        setUser('');
        handleClose();
    }

    const checkUserExists=()=>{  //check the user exists if so login, if not return error 
     //that they dont exist in the db and should signup first
        const exist = userDocs.find((user)=> user.username===username && user.password===password)
        if(exist){
            //log them in, store their username and password
            onLogin(username);
            handleCloseD();
        }
        else{
            //return an error message
            setError("Whoops not a user, use the signup button to create a dialog")
        }
        
    }

    return(
        <Dialog open={open} onClose={handleClose} >
            <DialogTitle>LogIn</DialogTitle>
            <DialogContent>
                <TextField
                    label="Username"
                    value={username}
                    onChange={(e) => setUser(e.target.value)}>
                </TextField>

                <TextField
                    label="Password"
                    value={password}
                    onChange={(e) => setPass(e.target.value)}>
                </TextField>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </DialogContent>
            <DialogContent>
                <Button onClick={checkUserExists}> Login</Button>
                <Button onClick={handleCloseD} >Close</Button>
            </DialogContent>

        </Dialog>
    )

};

export default LoginDialog;