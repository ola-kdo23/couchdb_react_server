import React,{useState} from "react";
import axios from "axios";
//try and make this one into a dialog

const QuestionForm= ({parChannel, onAddQuestion, author}) =>{
    const[topic,setTopic]=useState('');
    const[data,setBody]=useState('');
    const[images,setImage]=useState([]);
    const[userId, setId]=useState(''); //get the user id so we can send it to the end point

    axios.get('http://0.0.0.0:3000/allusers').then(res=>{
        //loop through all the users, if the username is == to author then set the userId
        const user = res.data.userDocs.find(user => user.username === author);
        if (user) {
          setId(user._id); // Assuming the user ID is stored in the _id field
        }
    }).catch(error=>console.error(error));

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

        //update the users database to show the number of posts that they have
        axios.post(`http://0.0.0.0:3000/updatenumposts/${userId}`).then((response) => {
            console.log("User's number of posts updated:", response.data.numOfposts);
        }).catch(error=>console.error(error))
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