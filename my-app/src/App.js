
import message from './message.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={message} className="App-logo" alt="randostring" />
        <p className="App-intro"> Ask your question, get the answer you need.</p>
        <p className="App-body"> Welcome to post questions system where you are able to post questions that other users may respond
          to provided they have an answer, and you may engage with other's questions. Got a something on your
          mind? Post your first question today, chances are someones willing to help explain!
        </p>   
      </header>
    </div>
  );
}

export default App;
