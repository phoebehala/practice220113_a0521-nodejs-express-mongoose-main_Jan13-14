const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
require('dotenv').config()

let db
 
// for server connection
exports.mongoConnect = (callback) => {
    // returns promise
    //MongoClient.connect(process.env.MONGODB_URL)
    MongoClient.connect(process.env.MONGODB_URL)
    .then(client => {
        console.log('Connected to Database')
        db = client.db('nodeshop') //  client.db() >>> extract db
        callback()     // if it coonects to db, listen port
    })
    .catch(err => {
        console.log('Error in mongo Connect: ', err)
    })
}



exports.getDB = () => {
    // to check if db exist
    if(db){
        return db
        //console.log(db);
    }
    throw 'No database found'
}

