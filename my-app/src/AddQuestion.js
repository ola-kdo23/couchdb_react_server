import React,{useState} from "react";
import axios from "axios";
//try and make this one into a dialog

const QuestionForm= ({parChannel, onAddQuestion}) =>{
    const[topic,setTopic]=useState('');
    const[data,setBody]=useState('');

    const addQuestion=()=>{
        axios.post('http://0.0.0.0:3000/postquestion', { parChannel, topic: topic, question: data }).then(res=>{
            console.log(res.data);
            onAddQuestion();
        }).catch(error=>console.error(error));
    }

    return(
        <div className="Question">
            <label> Topic: 
                <input type='text' value={topic} onChange={e=>setTopic(e.target.value)} />
            </label>
            <label> Question: 
                <input type='text' value={data} onChange={e=>setBody(e.target.value)} />
            </label>
            <button onClick={addQuestion}>Add Question</button>
        </div> 

    )


};
export default QuestionForm;