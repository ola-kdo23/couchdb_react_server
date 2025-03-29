const express = require('express');
const bodyParser = require('body-parser');
const nano = require('nano');
const datentime = require('date-and-time');
const cors = require('cors');

const app = express();  //instantiate the express app
const PORT = 3000;
const HOST = '0.0.0.0';

//set up our middleware for communication
//app.use();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//set up couchdb variables
const COUCHDB_URL = 'http://admin:password@couchdb:5984' || process.env.COUCHDB_URL;
const COUCHDB_DB = 'communicationsdb' || process.env.COUCHDB_DB;

const couch = nano(COUCHDB_URL);

//create the database if it doesnt already exist
(async()=>{
    const dbList= await couch.db.list();
    try
    {if(!dbList.includes(COUCHDB_DB)){
        //create it
        await couch.db.create(COUCHDB_DB);
        console.log("Database is created");
    }
    else{
        console.log("Database already exists!");
    }}catch(error){
        console.error("Something went wrong with database!", error);
    }
})();

//get database to perform operations on
const infoDB = couch.use(COUCHDB_DB);

app.post('/postchannel', async (req,res)=>{
    //so the name of a channel 
    const topic = req.body.topic;
    const type = 'channel';
    const cur_date = new Date();
    const date = datentime.format(cur_date,"YY/MM/DD HH:mm:ss");

    if(!topic){
        return res.status(400).json({error:'Whoops need a name for your channel'});
    }
    //otherwise try and add it to the database
    try{
        const doc= await infoDB.insert({topic, type, date}); // it has a name, a type 'channel' and a date
        return res.status(200).json({success:true, id: doc.id});
    }catch(error){
        console.error("Oh no couldnt add the channel to the database", error);
    }

})

//create our posts and request endpoints
app.post('/postquestion', async(req,res)=>{
    //get the info from the request body and insert it into the database
    const {parChannel, topic,question} = req.body;
    const type = 'question';
    const cur_date = new Date();
    const date = datentime.format(cur_date,"YY/MM/DD HH:mm:ss");

    if(!parChannel || !question || !topic){
        return res.status(400).json({error:'Invalid, need a topic and a question and must be attached to a channel'});
    }
    try{
        const doc = await infoDB.insert({parChannel,topic,question,type,date});
        return res.status(200).json({success: true, id: doc.id});
    }catch(error){
        console.error("Whoops couldnt insert question into the database", error);
    }


});
app.post('/postanswer',async(req,res)=>{
    const {parentId, answer} =req.body;
    const type='answer';
    const cur_date= new Date();
    const date= datentime.format(cur_date,"YY/MM/DD HH:mm:ss");

    if(!parentId|| !answer){
        return res.status(400).json({error: "Invalid, need a parent post and some data"})
    }
    try{
        const doc= await infoDB.insert({parentId,answer,type,date});
        return res.status(200).json({success: true, id: doc.id});

    }catch(error){
        console.error("Whoops couldnt insert response into the database", error);
    }

});

//create an all data endpoint to retreive all the data
app.get('/alldata', async (req,res)=>{
    try{
        //okay get your docs
        const allDocs = await infoDB.list({include_docs: true});

        //differentiate your channels, questions and answers:
        const channels = allDocs.rows.filter(channel => channel.doc.type === 'channel');
        const questions = allDocs.rows.filter(question=> question.doc.type==='question');
        const answers = allDocs.rows.filter(answer=>answer.doc.type==='answer');

        // const getResponses=(parentId)=>{  //recursively get the nested responses
        //     answers.rows.filter(ans=> ans.doc.parentId===parentId).map(ans=>{
        //         return{
        //             id:ans.id,
        //             parentId:ans.doc.parentId,
        //             type:ans.doc.type,
        //             data:ans.doc.data,
        //             date:ans.doc.date,
        //             replies: getResponses(ans.id)
        //         }
        //     })
        // }

        // const docs=questions.map(question => {
        //     return{ //return an object that contains info of the question
        //         id:question.id,
        //         topic:question.doc.topic,
        //         type:question.doc.type,
        //         data:question.doc.data,
        //         date:question.doc.date,
        //         responses: getResponses( question.id)
        //     }
        // })

        //now we're introducing channels lets send all the channels with their respective questions
        const docs=channels.map(channel=>{
            const myquestions=questions.filter(question=>question.doc.parChannel===channel.id);
            return{
                id: channel.id,
                topic: channel.doc.topic,
                date: channel.doc.date,
                questions: myquestions.map(q=>({
                    id: q.id,
                    topic: q.doc.topic,
                    question: q.doc.question,
                    date: q.doc.date,
                    answers: answers.filter(ans=> ans.doc.parentId=== q.id).map( ans=> ({
                        id: ans.id,
                        answer: ans.doc.answer,
                        date: ans.doc.date
                    }))
                }))
            }
        })


        return res.status(200).json({docs}) //send that over
    
    }catch(error){
        console.error("Whoops an error occured while fetching data", error);
    }
});

//open the port
app.listen(PORT,HOST,()=>{
    console.log(`Server is running at http://${HOST}:${PORT}`);
})
