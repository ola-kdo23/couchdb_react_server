const express = require('express');
const bodyParser = require('body-parser');
const nano = require('nano');
const datentime = require('date-and-time');
const cors = require('cors');
const multer = require('multer'); 
const path = require("path")

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
const COUCHDB_DB2= 'communitydb'

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

    //if users database doesnt exist then create
    try
    {if(!dbList.includes(COUCHDB_DB2)){
        //create it
        await couch.db.create(COUCHDB_DB2);
        console.log("Database for users is created");
    }
    else{
        console.log("Database for users already exists!");
    }}catch(error){
        console.error("Something went wrong with the users database!", error);
    }

})();

//get database to perform operations on
const infoDB = couch.use(COUCHDB_DB);
const userDB = couch.use(COUCHDB_DB2);

//setting up storage for the imgages using multer
const storage = multer.diskStorage({  //<--this essentially gives control on where to store files on disk
    destination: function(req,file,cb){
        cb(null,'./my_images');
    },
    filename: function(req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); //taken from the npm mutler page: https://www.npmjs.com/package/multer
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); //add the extension manually
    }
})

const upload = multer({ storage: storage })
app.use('/my_images',express.static('my_images'));



//-------------------------------------communications data base endpoints---------------------------------------------------

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
app.post('/postquestion',upload.array('images',3) ,async(req,res)=>{   //update q and a endpoints to take images
    //get the info from the request body and insert it into the database
    const {parChannel, topic,question} = req.body;
    const type = 'question';
    const cur_date = new Date();
    const date = datentime.format(cur_date,"YY/MM/DD HH:mm:ss");
    //get the images if any at all
    const allImages=req.files.map(file=> `/my_images/${file.filename}`)
    
    if(!parChannel || !question || !topic){
        return res.status(400).json({error:'Invalid, need a topic and a question and must be attached to a channel'});
    }

    try{
        const doc = await infoDB.insert({parChannel,topic,question,type,date,allImages});
        return res.status(200).json({success: true, id: doc.id});
    }catch(error){
        console.error("Whoops couldnt insert question into the database", error);
    }


});
app.post('/postanswer',upload.array('images',3),async(req,res)=>{
    const {parentId, answer} =req.body;
    const type='answer';
    const cur_date= new Date();
    const date= datentime.format(cur_date,"YY/MM/DD HH:mm:ss");
    const allImages=req.files.map(file=> `/my_images/${file.filename}`)

    if(!parentId|| !answer){
        return res.status(400).json({error: "Invalid, need a parent post and some data"})
    }
    try{
        const doc= await infoDB.insert({parentId,answer,type,date,allImages});
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
                    allImages:q.doc.allImages||[],
                    date: q.doc.date,
                    answers: answers.filter(ans=> ans.doc.parentId=== q.id).map( ans=> ({
                        id: ans.id,
                        answer: ans.doc.answer,
                        allImages: ans.doc.allImages||[],
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

//-------------------------------------community data base endpoints---------------------------------------------------

app.post('/appusers', async(req,res) =>{
    const{username,password}=req.body; //just get their id and password
    
    if(!username||!password){
        res.status(400).json({error:"Couldn't log in, need a username and password"})
    }
    //insert into the userdb
    try{
        const doc= await userDB.insert({username,password});
        res.status(200).json({success: true, id: doc.id})
    }catch(error){
        console.log("whoops couldn't insert to database", error);
    }

})

app.get('/allusers', async (req,res)=>{
    try{
        //okay get your docs
        const allrows = await userDB.list({include_docs: true});
        const userDocs=allrows.rows.map(row=>row.doc); //send as an array of users so its easy to check over users during login
        return res.status(200).json({userDocs});
    }catch(error){
        console.error("Whoops couldnt get all the user documents",error);
    }
})


//open the port
app.listen(PORT,HOST,()=>{
    console.log(`Server is running at http://${HOST}:${PORT}`);
})
