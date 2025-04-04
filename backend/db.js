const mongoose = require('mongoose')

const Connect = async () => {
    try{
        await mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    } catch(err){
        console.log("Error : ", err)
    }
}
const isConnected = () => mongoose.connection.readyState === 1 ? true:false
module.exports = {Connect, isConnected}