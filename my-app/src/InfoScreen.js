import React,{useState} from "react";
import {Link} from 'react-router-dom';
import message from './message.svg';
import SignupDialog from "./Signup";
import LoginDialog from "./LogIn";

function LandingPage() {

  const [open, setOpen] = useState(false);
  const [updateList, setUpdateList] = useState(false);

  const handleOpen = () => {
    setOpen(true); // Open the dialog
  };

  const handleClose = () => {
    setOpen(false); // Close the dialog
  };

  const handleAddUser = () => {
    setUpdateList(!updateList); 
  };
  

  return (
      <div className="Landing">
        <div className="Landing-bspace">
          <Link to='/Channel'><button className="Landing-Button"> Channels </button></Link>
        </div>
        <div className="Signup-bspace">
          <button onClick={handleOpen} className="Signup-button">Signup</button>
          <SignupDialog onAddUser={handleAddUser} open={open} handleClose={handleClose}/>
        </div>
        <div className="Login-bspace">
          <button onClick={handleOpen} className="Login-button">Login</button>
          <LoginDialog open={open} handleClose={handleClose}/>
        </div>
        <header className="Landing-header">
          <h1>PostThat</h1>
          <img src={message} className="Landing-logo" alt="randostring" />
          <p className="Landing-intro"> Ask your question, get the answer you need.</p>
          <p className="Landing-body"> Welcome to post questions system where you are able to post questions that other users may respond
            to provided they have an answer, and you may engage with other's questions. Got a something on your
            mind? Post your first question today, chances are someones willing to help explain!
          </p>   
          </header>
      </div>
    );
}
export default LandingPage;