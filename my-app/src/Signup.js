//okay the sign up screen adds the user to the databse
//the login screen varifies that the user is a member


import React,{ useState} from "react";
import axios from "axios";
import {Button, Dialog, DialogContent, DialogTitle, TextField} from '@mui/material';

const SignupDialog=({onAddUser, open, handleClose})=>{
    //store the user name and password
    const[username, setUser]=useState('');
    const[password,setPass]=useState('');

    const handleCloseD=()=>{   //reset the values after 
        setPass('');
        setUser('');
        handleClose();
    }

    
    const addUser=()=>{
        axios.post('http://0.0.0.0:3000/appusers',{username,password}).then(res=>{
        console.log(res.data);
        onAddUser();
        }).catch(error=> console.error(error));
    };

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
            </DialogContent>
            <DialogContent>
                <Button onClick={addUser}>Signup</Button>
                <Button onClick={handleCloseD} >Close</Button>
            </DialogContent>

        </Dialog>
    )
};

export default SignupDialog;