import React,{ useState, useEffect} from "react";
import axios from "axios";
import QuestionForm from "./AddQuestion";
import AnswerForm from "./AddAnswer";

const AllChannels= () => {

    const[chans,setChannels]=useState([]);

    //set up channels and get all docs
    useEffect(() => {
        axios.get('http://0.0.0.0:3000/alldata')
            .then(res => {
                // Ensure topics is always an array
                setChannels(res.data.docs || []);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    //set up questions i.e retrieve them and show them on the webpage
    const handleQuestions=()=>{
        axios.get('http://0.0.0.0:3000/alldata')
        .then(res=>{
            setChannels(res.data.allDocs || []); //update whenever a new response is added
        })
        .catch(error => console.error("Error fetching data:", error))
    }


    //set up answers i.e retrieve them and show them on the webpage
    const handleAnswers=()=>{
        axios.get('http://0.0.0.0:3000/alldata')
        .then(res=>{
            setChannels(res.data.allDocs || []); //update whenever a new response is added
        })
        .catch(error => console.error("Error fetching data:", error))
    }
    
    const showAnswers=(answers)=>{
        return answers.map(ans=>(
            <div key={ans.id} >
                <p>{ans.answer}</p>
                {ans.allImages && ans.allImages.length > 0 && (
                    <div>
                    {ans.allImages.map((url, index) => (
                        <img key={index} src={`http://localhost:3000${url}`} alt={`question-image-${index}`} style={{ maxWidth: "100%", marginBottom: "10px" }} />  //<---check this!
                    ))}
                    </div>
                )}
                <p><em>Answered at: {ans.date}</em></p>
            </div>
        ))

    }

    
    const showQuestions=(questions)=>{
        return questions.map(q=>(
            <div key={q.id} >
                <p>{q.topic}</p>
                <p>{q.question}</p>

                {q.allImages && q.allImages.length > 0 && (
                    <div>
                    {q.allImages.map((url, index) => (
                        <img key={index} src={`http://localhost:3000${url}`} alt={`question-image-${index}`} style={{ maxWidth: "100%", marginBottom: "10px" }} />  //<---check this!
                    ))}
                    </div>
                )}
                <p><em>Posted at: {q.date}</em></p>
                
                {/* show the answer form for each question thats made and display all its answers*/}
                <AnswerForm parentQ={q.id} onAddAnswer={handleAnswers}/>
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
                        <h3>Discussion: {c.topic}</h3>
                        <p><em>Created on: {c.date}</em></p>
                    </div>
                    <QuestionForm parChannel={c.id} onAddQuestion={handleQuestions}/>
                    <div className="channel-posts">
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