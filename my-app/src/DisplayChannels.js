import React,{ useState, useEffect} from "react";
import axios from "axios";
import QuestionForm from "./AddQuestion";
import AnswerForm from "./AddAnswer";
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

const AllChannels= ({author, admin, channels}) => {

    const[chans,setChannels]=useState(channels);

    useEffect(() => {
        setChannels(channels)
     }, [channels]);




    const handleChannelDelete =(channelid)=>{
        axios.delete(`http://0.0.0.0:3000/deletechannel/${channelid}`)
        .then(res=>{
            setChannels(prevChannels => prevChannels.filter(channel => channel.id !== channelid)); //update whenever a new response is added
        })
        .catch(error => console.error("Error fetching data:", error))
    }

    const handleQuestionDelete =(questionid)=>{
        axios.delete(`http://0.0.0.0:3000/deletequestion/${questionid}`)
        .then(res => {
            // Re-fetch all data after deleting the question
            axios.get('http://0.0.0.0:3000/alldata')
                .then(res => {
                    setChannels(res.data.docs || []); // Update with the latest data
                })
                .catch(error => console.error("Error fetching data:", error));
        })
        .catch(error => console.error("Error deleting question:", error));
    }

    const handleAnswerDelete =(answerid)=>{
        axios.delete(`http://0.0.0.0:3000/deleteanswer/${answerid}`)
        .then(res => {
            axios.get('http://0.0.0.0:3000/alldata')
                .then(res => {
                    setChannels(res.data.docs || []);
                })
                .catch(error => console.error("Error fetching data:", error));
        })
        .catch(error => console.error("Error deleting question:", error));
    }

    //set up questions i.e retrieve them and show them on the webpage
    const handleQuestions=()=>{
        axios.get('http://0.0.0.0:3000/alldata')
        .then(res=>{
            setChannels(res.data.docs || []); //update whenever a new response is added
        })
        .catch(error => console.error("Error fetching data:", error))
    }


    //set up answers i.e retrieve them and show them on the webpage
    const handleAnswers=()=>{
        axios.get('http://0.0.0.0:3000/alldata')
        .then(res=>{
            setChannels(res.data.docs || []); //update whenever a new response is added
        })
        .catch(error => console.error("Error fetching data:", error))
    }
    
    // Function to handle like and dislike actions
    const handleLikeDislike = (id, type, increment) => {
        axios.post(`http://0.0.0.0:3000/updateLikes/${id}`, {
            type: type,
            increment: increment
        })
        .then(res => {
            // Update the UI with new like/dislike counts
            axios.get('http://0.0.0.0:3000/alldata')
                .then(res => {
                    setChannels(res.data.docs || []);
                })
                .catch(error => console.error("Error fetching data:", error));
        })
        .catch(error => console.error("Error updating like/dislike:", error));
    };

    //show all the answers
    const showAnswers=(answers)=>{
        return answers.map(ans=>(
            <div className='channel-answers' key={ans.id} >
                <p>{ans.answer}</p>
                <div>
                    <button onClick={() => handleLikeDislike(ans.id, 'answer', 1)}>
                        <FaThumbsUp style={{ color: 'gray' }} />
                    </button>
                    <span>{ans.likes}</span>
                    <button onClick={() => handleLikeDislike(ans.id, 'answer', -1)}>
                        <FaThumbsDown style={{ color: 'gray' }} />
                    </button>
                    <span>{ans.dislikes}</span>
                </div>  
                <p>Answered by: {ans.author}</p>
                {ans.allImages && ans.allImages.length > 0 && (
                    <div>
                    {ans.allImages.map((url, index) => (
                        <img key={index} src={`http://localhost:3000${url}`} alt={`question-image-${index}`} style={{ maxWidth: "100%", marginBottom: "10px" }} />  //<---check this!
                    ))}
                    </div>
                )}
                <p><em>Answered at: {ans.date}</em>{admin === 'true'? <button className="Button" onClick={()=>handleAnswerDelete(ans.id)}>Delete Answer </button> : null}</p>
                
                <AnswerForm parentQ={ans.id} onAddAnswer={handleAnswers} author={author}/> {/*allowing the answers to also have nested responses */}
                {ans.replies.length >0 ? (   
                    showAnswers(ans.replies)
                ):(
                    <p>No answers yet.</p>
                )}

            </div>
        ))

    }

    //show all the questions
    const showQuestions=(questions)=>{
        return questions.map(q=>(
            <div className='channel-questions' key={q.id} >
                <p>{q.topic}</p>
                <p>{q.question}  </p>
                <div>
                    <button onClick={() => handleLikeDislike(q.id, 'question', 1)}>
                        <FaThumbsUp style={{ color: 'gray' }} />
                    </button>
                    <span>{q.likes}</span>
                    <button onClick={() => handleLikeDislike(q.id, 'question', -1)}>
                        <FaThumbsDown style={{ color: 'gray' }} />
                    </button>
                    <span>{q.dislikes}</span>
                </div>
                <p>Asked by: {q.author}</p>
                {q.allImages && q.allImages.length > 0 && (
                    <div>
                    {q.allImages.map((url, index) => (
                        <img key={index} src={`http://localhost:3000${url}`} alt={`question-image-${index}`} style={{ maxWidth: "100%", marginBottom: "10px" }} />  //<---check this!
                    ))}
                    </div>
                )}
                <p><em>Posted at: {q.date}</em>{admin === 'true' ? <button className="Button" onClick={()=>handleQuestionDelete(q.id)}>Delete Question </button> : null}
                </p>
                {/* show the answer form for each question thats made and display all its answers*/}
                <AnswerForm parentQ={q.id} onAddAnswer={handleAnswers} author={author}/>
                {q.answers.length >0 ? (   
                    showAnswers(q.answers)
                ):(
                    <p>No answers yet.</p>
                )}

            </div>
        ))

    }

    


    return(
        <div className="Channels-conatiner"> 
            {chans.length > 0 ? 
            (chans.map(c=>(
                <div key={c.id} className="channel-container">
                    <div className="channel-header">
                        <h3>{c.topic} Channel</h3>
                        <p><em>Created on: {c.date} by: {c.author}</em>{admin === 'true' ? (<button className="Button" onClick={ ()=>handleChannelDelete(c.id)} >Delete Channel </button>) :( null)}
                        </p>
                        
                    </div>
                    <QuestionForm parChannel={c.id} onAddQuestion={handleQuestions} author={author}/>
                    <div>
                        <h4>Questions:</h4>
                        {/*Okay create a way to show display the questions here */}
                        {c.questions.length > 0 ? (
                                showQuestions(c.questions)

                        ) : (
                                <p>No questions yet.</p>
                        )}
                    </div>
                </div>
            )))
            :
            (
                <div>No channels have been made yet</div>
            )
        }
        </div>
    )
}
export default AllChannels;