import React,{useState} from "react";
import {Link} from 'react-router-dom';
import message from './message.svg';
import SignupDialog from "./Signup";
import LoginDialog from "./LogIn";

function LandingPage() {

  const [openL, setOpenL] = useState(false);
  const [openS, setOpenS] = useState(false);
  const [updateList, setUpdateList] = useState(false);
  const [curUser,setCurUser] = useState(null);
  const [issue, setIssue] =useState('');
  const [isAdmin,setIsAdmin] = useState(false);

  const admin="admin123"; //set up the admin

  //the login dialog
  const handleOpenL = () => { setOpenL(true); };
  const handleCloseL = () => {setOpenL(false); };
  const handleLogin=(curUsername)=>{ 
    setCurUser(curUsername);
    if(curUsername === admin){
      setIsAdmin(true);
    }
  };
 
  //the signup dialog
  const handleOpenS = () => {setOpenS(true);};
  const handleCloseS = () => {setOpenS(false);};
  const handleSignup=(curUsername)=>{setCurUser(curUsername);};
 
  const handleAddUser = () => {setUpdateList(!updateList);};
   

//--------------need to fix these two---------------------
  const handlenoLogin =()=>{
    setIssue("whoops you need to login or create an account to access the channels page");
  };
  const handleissue=()=>{
    if(!curUser){
      handlenoLogin();
    }
  };
  console.log(issue);
//--------------------------------------------------------

  return (
      <div className="Landing">
        
        <div className="Signup-bspace">
          <button onClick={handleOpenS} className="Signup-button">Signup</button>
          <SignupDialog onAddUser={handleAddUser} open={openS} handleClose={handleCloseS} onSignup={handleSignup}/>
        </div>
        
        <div className="Login-bspace">
          <button onClick={handleOpenL} className="Login-button">Login</button>
          <LoginDialog open={openL} handleClose={handleCloseL} onLogin={handleLogin}/>
        </div>
        
        <div className="Landing-bspace">  {/*now button only works if the user is logged in */}
          <Link to={`/Channel?user=${curUser}&admin=${isAdmin}`}> 
          <button className="Landing-Button" disabled={!curUser} onClick={handleissue}> Channels </button>
          </Link>
        </div>
        {issue && <p style={{ color: 'red' }}>{issue}</p>} {/*doesnt seem to be working right now! */}
        
        <header className="Landing-header">
          <h1>Welcome {curUser}!</h1>
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