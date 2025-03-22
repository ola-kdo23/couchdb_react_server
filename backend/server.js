const express = require('express');
const bodyParser = require('body-parser');
const nano = require('nano');
const datentime = require('date-and-time');
const cors = require('cors');

const app = express();  //instantiate the express app
const PORT = 3000;
const HOST = '0.0.0.0';

//set up our middleware for communication
app.use();
app.use(cors());

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

//create our posts and request endpoints
app.post('/postquestion', async(req,res)=>{
    //get the info from the request body and insert it into the database
    const[topic,question] = req.body;
    const type = 'question';
    const cur_date = new Date();
    const date = datentime.format(cur_date,"YY/MM/DD HH:mm:ss");

    if(!question || !topic){
        return res.status(400).json({error:'Invalid, need a topic and a question'});
    }
    try{
        const doc = await infoDB.insert({topic,question,type,date});
        return res.status(200).json({success: true, id: doc.id});
    }catch(error){
        console.error("Whoops couldnt insert question into the database", error);
    }


});
app.post('/postanswer',async(req,res)=>{
    const[parentId, answer]=req.body;
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
    try{//okay get your posts
        const allDocs = await infoDB.db.list({include_docs: true});

        //differentiate your questions from your answers:
        const questions = allDocs.rows.filter(question=> question.doc.type==='question');
        const answers = allDocs.rows.filter(answer=>answer.doc.type==='answer');

        const getResponses=(parentId)=>{  //recursively get the nested responses
            answers.rows.filter(ans=> ans.doc.parentId===parentId).map(ans=>{
                return{
                    id:ans.id,
                    parentId:ans.doc.parentId,
                    type:ans.doc.type,
                    data:ans.doc.data,
                    date:ans.doc.date,
                    replies: getResponses(ans.id)
                }
            })
        }

        const docs=questions.rows.map(question => {
            return{ //return an object that contains info of the question
                id:question.id,
                topic:question.doc.topic,
                type:question.doc.type,
                data:question.doc.data,
                date:question.doc.date,
                responses: getResponses( question.id)
            }
        })
        return res.status(200).json({docs})
    
    //send that over
    }catch(error){
        console.error("Whoops an error occured while fetching data", error);
    }
});

//open the port
app.listen(PORT,HOST,()=>{
    console.log(`Server is running at http://${HOST}:${PORT}`);
})
