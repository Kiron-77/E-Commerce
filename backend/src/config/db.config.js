require("dotenv").config()
const mongoose = require("mongoose")
const dbConnect = async () => {
    try {
        let url = encodeURI(process.env.MONGO_DB_URL)
        await mongoose.connect(
            url, {
                dbName: process.env.MONGO_DB_NAME,
                autoCreate:true,
                autoIndex:true
            }
        )
        console.log("Db server connected successfully")
    } catch (exception) {
        console.log("Error connecting database")
        process.exit()
    }
}
dbConnect()
