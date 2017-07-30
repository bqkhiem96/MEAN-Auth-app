const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const config = require('./config/database');

//Connect to Database
mongoose.connect(config.database);

//Mongoose is on Connection
mongoose.connection.on('connected',()=>{
    console.log("connected to db" + config.database);
});

//Mongoose got error
mongoose.connection.on('error',(err)=>{
    console.log("Database err" + err);
});

const app =  express();

const users = require('./routes/users');

//Port number 
const port = 3000; 

//Use this to automatically headers 
app.use(cors());

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Body Parser middleware
app.use(bodyParser.json());


//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);


app.use('/users', users);

app.get('/', (req,res) => {
    res.send('Invalid endpoint');
})

//Start Server
app.listen(port,() => {
    console.log('Server started on port: ' + port);
})