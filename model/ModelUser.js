const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        requireed: true
    },
    avatar:{
        type:String
    },
    email:{
        type: String,
        required:true
    },
    password: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model('ModelUser', userSchema);