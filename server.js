const express = require('express');
const colors = require('colors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectdb = require('./config/db');

const app = express();

app.use(morgan('dev'));

app.get('/todo', (req, res) =>{
    res.status(200).json({
        "name": "Vicky2",
    
    });
});

dotenv.config({
    path: './config/config.env'
});

connectdb();
//for json parsing on cosole.
app.use(express.json({}));
app.use(express.json({
    extened:true
}));

app.use('/api/todo/auth', require('./routes/userRoutes'));
const PORT = process.env.PORT || 3000;
app.listen(PORT,
    console.log(`server is running on port = ${PORT}:`.green.underline.bold)
    );