require('dotenv').config()

const express = require('express')
const bodyParser = require("body-parser");
const connectDB = require('./db/connect');
const twilioRoute = require('./routes/twillio')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1',twilioRoute);



const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    const port = process.env.PORT || 7000; // Use process.env.PORT for Heroku, fallback to 3000 locally
    app.listen(port, () => {
      console.log(`The server is listening on port ${port}...`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();


