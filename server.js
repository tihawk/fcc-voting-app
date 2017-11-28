const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config({verbose: true});

app.use(bodyParser.json());

app.use(express.static(__dirname + '/client'));

app.listen(process.env.PORT, ()=>{
	console.log('Listening on port ' + process.env.PORT);
});