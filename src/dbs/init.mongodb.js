const mongoose = require('mongoose')
const { db: {user, pass, name} } =  require('../configs/config.db')

// ab -c 20 -t 10 url
const { countConnect } = require('../helpers/check.connect')
const connectionString = `mongodb+srv://${user}:${pass}@clustertuan.x9wtf.mongodb.net/${name}?retryWrites=true&w=majority`
     
class Database {
    static instance = null

    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {
        if (1) {
            mongoose.set('debug', true)
            mongoose.set('debug', {color:true})
        }
        mongoose.connect(connectionString, {
            maxPoolSize: 50
        }).then( () => {
            console.log("Connect succesfully!");
            console.log(`Counter connect: ${countConnect()}`);
        })
        .catch(err => {
            console.log(`Connect fail: ${err}`);
        })

        return mongoose
    }

    static getInstance() {
        if (!Database.instance) {
            return Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceDB = Database.getInstance()
module.exports = instanceDB