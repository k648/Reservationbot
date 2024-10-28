require('dotenv').config()

const express = require('express')
const bodyParser = require("body-parser");
const twilioDB = require('./db/connect');
const twilioRoute = require('./routes/twillio')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1',twilioRoute);

app.get('/',(req,res)=>{
  res.send('welcome to nodejs app')
})

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});



port = process.env.Port || 3000;




const start = async ()=>{
  try{  
    await twilioDB(process.env.MONGO_URI)
    app.listen(port , ()=>{ console.log(`the server is listening on port ${port}...`)});
    } catch(error){
     console.log(error)
    }
}

start()