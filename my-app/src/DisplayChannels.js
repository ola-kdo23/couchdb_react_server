import React,{ useState, useEffect} from "react";
import axios from "axios";
import QuestionForm from "./AddQuestion";

const AllChannels= () => {

    const[chans,setChannels]=useState([]);

    useEffect(() => {
        axios.get('http://0.0.0.0:3000/alldata')
            .then(res => {
                // Ensure topics is always an array
                setChannels(res.data.docs || []);
            })
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    const handleQuestions=()=>{
        axios.get('http://0.0.0.0:3000/alldata')
        .then(res=>{
            setChannels(res.data.allDocs || []); //update whenever a new response is added
        })
        .catch(error => console.error("Error fetching data:", error))
    }
    const showQuestions=(questions)=>{
        return questions.map(q=>(
            <div key={q.id} >
                <p>{q.topic}</p>
                <p>{q.question}</p>
                <p><em>Posted at: {q.date}</em></p>
            </div>
        ))

    }

    return(
        <div className="Channels-conatiner"> 
            {chans.length > 0 ? 
            (chans.map(c=>(
                <div key={c.id} className="channel-container">
                    <div className="channel-header">
                        <h3>Discussion on: {c.topic}</h3>
                        <p><em>Posted on: {c.date}</em></p>
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