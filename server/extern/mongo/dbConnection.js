const MongoClient = require('mongodb').MongoClient

var env = process.env.NODE_ENV || 'development';
const credentials = require('../config/credentials')[env]



class DBConnection {
    static connect() {
        if ( this.db ) return Promise.resolve(this.db)
        return MongoClient.connect(credentials.database.url, this.options)
            .then(db => this.db = db)
            .catch(err => {console.log(err)});
    }
}

DBConnection.db = null
DBConnection.options = {
    bufferMaxEntries:   0,
    reconnectTries:     5000,
    useNewUrlParser: true
}

module.exports = { DBConnection }