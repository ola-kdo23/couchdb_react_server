import React,{useState} from "react";
import axios from "axios";
//try and make this one into a dialog

const QuestionForm= ({parChannel, onAddQuestion, author}) =>{
    const[topic,setTopic]=useState('');
    const[data,setBody]=useState('');
    const[images,setImage]=useState([]);

    const handleImages=(e)=>{  //update to using a form
        setImage(e.target.files)
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("parChannel", parChannel);
        formData.append("topic", topic);
        formData.append("question", data);
        formData.append("author",author)
        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }
    
        axios.post('http://0.0.0.0:3000/postquestion', formData).then(res=>{
            console.log(res.data);
            onAddQuestion();
            setTopic('');
            setBody('');
            setImage([]);
        }).catch(error=>console.error(error));
    };

    return(
        <div className="Question">
            <h3>Ask a question</h3>
            <form onSubmit={handleSubmit}>
                <label> Topic: 
                    <input type='text' value={topic} onChange={e=>setTopic(e.target.value)} />
                </label>
                <label> Question: 
                    <textarea type='text' value={data} onChange={e=>setBody(e.target.value)} />
                </label>
                <label>Images (optional):
                    <input type='file' accept="image/*" multiple onChange={handleImages}/>
                </label>
                <button className='Button' type="submit">Add Question</button>
            </form>
        </div> 

    )


};
export default QuestionForm;