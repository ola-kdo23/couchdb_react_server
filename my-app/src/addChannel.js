import React,{ useState} from "react";
import axios from 'axios';

//what does adding a channel mean? we want it to be like a button or what?

const ChannelForm = ({ onAddChannel }) => {
  const [topic, setTopic] = useState('');
  //const [response, setResponse] = useState('');

  const addChannel = () => {
    axios.post('http://0.0.0.0:3000/postchannel', { topic })
      .then(res => {
        console.log(res.data);
        onAddChannel();
      })
      .catch(error => console.error(error));
  };

  return (
    <div className="Channel-cont">
      <h2>Add Channel</h2>
      <label>
        Topic:
        <input type="text" value={topic} onChange={e => setTopic(e.target.value)} />
      </label>
      <button className='Button' onClick={addChannel}>Add Channel</button>
    </div>
  );
};

export default ChannelForm;