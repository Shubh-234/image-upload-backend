const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({path : './.env'})


const dbConnection = async () => {
    try {
        console.log(`trying to connect to db on the port ${process.env.PORT}`)
        await mongoose.connect(process.env.MONGO_URI)
        console.log('connected to db succesfully')
    } catch (error) {
        console.log(error)
        process.exit(1);    
    }
}

module.exports = {dbConnection};