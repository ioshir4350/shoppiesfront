const axios = require('axios')
const ipHandling = require('./ipHandling')
const User = require('../models/User')

function nominate(req, res){
    const movieID = req.body.movieID
    const IP4 = ipHandling.getLocalIP()
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
}

function remove(req, res){
    const movieID = req.body.movieID
    const IP4 = ipHandling.getLocalIP()
    User.findOne({ipAddress: IP4}, (err, foundUser) => {
        if (err) console.log(err);
        else{
            foundUser.nominations.splice(foundUser.nominations.indexOf(movieID), 1)
            foundUser.save()
            res.json({'status': 'removed'})
        }
})
}

function getNominations(req, res){
    const IP4 = ipHandling.getLocalIP()
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
}

exports.nominate = nominate
exports.remove = remove
exports.getNominations = getNominations