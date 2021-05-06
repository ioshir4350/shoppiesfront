//TODO hash IP Addresses
const express = require("express")
const { networkInterfaces } = require('os');
const axios = require('axios')
const bodyParser = require('body-parser')
const md5 = require('md5')

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

const userSchema = new mongoose.Schema({
    ipAddress: {type: String, required: true},
    nominations: { type: Array }
  });

const User = mongoose.model('User', userSchema)

const getLocalIP = () => {
    const nets = networkInterfaces();
    const results = Object.create(null); // or just '{}', an empty object

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
    
                results[name].push(net.address);
                return md5(net.address)
            }
        }
    }
}

app.post('/api/nominate', (req, res) => {
    const movieID = req.body.movieID
    const IP4 = getLocalIP()
    User.findOne({ipAddress: IP4}, (err, foundUser) => {
        if (err) console.log(err);
        else{
            if (foundUser){
                if (foundUser.nominations.includes(movieID)){
                    res.json({'status': 'already nominated'})
                }
                else{
                    foundUser.nominations.push(movieID)
                    foundUser.save()
                    res.json({'status': 'foundUser'})
                }
            }
            else{
                const newUser = new User({
                    ipAddress: IP4,
                    nominations: [movieID]
                })
                newUser.save()
                res.json({'status': 'registeredUser'})
            }
        }
    })
})

app.post('/api/remove', (req, res) => {
    const movieID = req.body.movieID
    const IP4 = getLocalIP()
    User.findOne({ipAddress: IP4}, (err, foundUser) => {
        if (err) console.log(err);
        else{
            foundUser.nominations.splice(foundUser.nominations.indexOf(movieID), 1)
            foundUser.save()
            res.json({'status': 'removed'})
        }
    })
})

app.get('/api/getNominations', (req, res) => {
    const IP4 = getLocalIP()
    User.findOne({ipAddress: IP4}, async (err, foundUser) => {
        if (err) console.log(err);
        else{
            if (foundUser) {
                let nominations = []

                for (let i = 0; i <= foundUser.nominations.length; i++){
                    const movieObj = await axios.get('http://www.omdbapi.com/?i='+ foundUser.nominations[i] +'&apikey=4bf894c9')
                    await nominations.push({
                        'Poster': movieObj.data.Poster,
                        'Title': movieObj.data.Title,
                        'Type': movieObj.data.Type,
                        'Year': movieObj.data.Year,
                        'imdbID': movieObj.data.imdbID
                    })
                    if (i == foundUser.nominations.length-1){
                        res.json({'nominations': nominations})
                   }
                }
            }
            else{
                res.json({'nominations': []})
            }
        }
    })
})

app.listen(8000, (req, res) => {
    console.log("server on 8000");
})