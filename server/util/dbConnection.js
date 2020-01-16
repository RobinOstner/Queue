const MongoClient = require('mongodb').MongoClient

var env = process.env.NODE_ENV || 'development';
const credentials = require('../config/credentials')[env]



class DBConnection {
    static connectToMongo() {
        if ( this.db ) return Promise.resolve(this.db)
        return MongoClient.connect(credentials.database.url, this.options)
            .then(db => this.db = db)
            .catch(err => {console.log(err)});
    }
}

DBConnection.db = null
//DBConnection.url = 'mongodb+srv://' + credentials.database.user +':' + credentials.database.password + '@queue-xdyvz.mongodb.net/test?retryWrites=true&w=majority'
//DBConnection.url = 'mongodb://' + credentials.database.user + ':' + credentials.database.password + '@'+ credentials.database.host + ':' + credentials.database.port + '/' + credentials.database.name;
//DBConnection.urlNoAuth = 'mongodb://' + credentials.database.host + ':' + credentials.database.port + '/' + credentials.database.name;
DBConnection.options = {
    bufferMaxEntries:   0,
    reconnectTries:     5000,
    useNewUrlParser: true
}

module.exports = { DBConnection }