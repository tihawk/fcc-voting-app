const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const router = require('./routes/api');
//use environmental variables
dotenv.config({verbose: true});
//connect to database
mongoose.connect(process.env.DB, {useMongoClient: true}, error=>{
	if(error) {throw error;}
});
//set custom promises for mongoose
mongoose.Promise = require('bluebird');
//express options
app.use(bodyParser.json());
app.use(express.static(__dirname + '/client'));
//use router
app.use('/api', router);
//server listen to port
app.listen(process.env.PORT, ()=>{
	console.log('Listening on port ' + process.env.PORT);
});