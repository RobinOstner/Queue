const MongoClient = require('mongodb').MongoClient

var env = process.env.NODE_ENV || 'development';
const credentials = require('../config/credentials')[env]



class DBConnection {
    static connectToMongo() {
        console.log("Trying to connect to db")
        if ( this.db ) return Promise.resolve(this.db)
        return MongoClient.connect(this.url, this.options, function(err, db) {
            if(err) {
                console.log("error occured" + err);
            } else {
                console.log("Connected to DB")
                this.db = db;
            }
        })
    }
}

DBConnection.db = null
DBConnection.url = 'mongodb://' + credentials.database.user + ':' + credentials.database.password +
    '@'+ credentials.database.host + ':' + credentials.database.port + '/' + credentials.database.name;
DBConnection.options = {
    bufferMaxEntries:   0,
    reconnectTries:     5000,
    useNewUrlParser: true
}

module.exports = { DBConnection }