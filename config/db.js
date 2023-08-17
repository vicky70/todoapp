const mongoose = require('mongoose');

connectdb = async()=>{
    const connt = await mongoose.connect(process.env.MONGO_URI);
    console.log(`${connt.connection.host}`);
}


module.exports = connectdb;