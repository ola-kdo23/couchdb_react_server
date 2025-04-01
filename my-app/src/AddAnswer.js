import React,{useState} from "react";
import axios from "axios";

const AnswerForm= ({parentQ, onAddAnswer, author}) =>{
    const[answer,setAnswer]=useState('');
    const[images,setImage]=useState([]);
    
    const handleImages=(e)=>{  //update to using a form
        setImage(e.target.files)
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        const formData = new FormData();
        formData.append("parentId", parentQ);
        formData.append("answer", answer);
        formData.append("author",author);
        for (let i = 0; i < images.length; i++) {
            formData.append("images", images[i]);
        }
    
        axios.post('http://0.0.0.0:3000/postanswer', formData).then(res=>{
            console.log(res.data);
            onAddAnswer();
            setAnswer('');
            setImage([]);
        }).catch(error=>console.error(error));
    };

    return(
        <div className="Answer">
            <form onSubmit={handleSubmit}>
                <label> Answer: 
                    <input type='text' value={answer} onChange={e=>setAnswer(e.target.value)} />
                </label>
                <label>Images (optional):
                    <input type='file' accept="image/*" multiple onChange={handleImages}/>
                </label>
                <button className='Button' type="submit">Add Answer</button>
            </form>
            <br/>
        </div> 

    )
};
export default AnswerForm;