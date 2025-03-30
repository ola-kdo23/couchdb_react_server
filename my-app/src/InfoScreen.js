import React from "react";
import {Link} from 'react-router-dom';
import message from './message.svg';
function LandingPage() {
    return (
        <div className="Landing">
          <div className="Landing-bspace">
            <Link to='/Channel'><button className="Landing-Button"> Channels </button></Link> {/* Okay ill come back and make this pretty later lets just give it functionality */}
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