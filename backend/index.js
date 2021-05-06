const express = require("express")
const bodyParser = require('body-parser')

const nominationRoutes = require('./routes/nomination')

const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  
    next();
  });

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

const URI = "mongodb+srv://isfar:LyHa2ks49M1d0YM4@cluster0.rsdak.mongodb.net/shoppies?retryWrites=true&w=majority"
const mongoose = require('mongoose')
const connectDB = async()=>{
  await mongoose.connect(URI, {useUnifiedTopology: true, useNewUrlParser: true});
  console.log('db connected!');
};

connectDB()

app.use('/api/nomination', nominationRoutes)

app.listen(8000, (req, res) => {
    console.log("server on 8000");
})