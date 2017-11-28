const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post('/verify_token', (req, res)=>{
	if(req.body.token){
		jwt.verify(req.body.token, process.env.SECRET, (err, decoded)=>{
			if(err){
				res.status(400).send('Invalid token');
			} else {
				res.status(200);
			}
		})
	} else {
		res.status(400).send('No token');
	}
});

router.post('/login', (req, res)=>{
	if(req.body.name && req.body.password){
		//console.log(req.body);
		User.findOne({name: req.body.name}, (err, doc)=>{
			if(err){
				res.status(400).send(err);
			} else if (doc) {
				bcrypt.compare(req.body.password, doc.password, (err, result)=>{
					if(err) {res.status(400).send(err);}
					else {
						if(result===true){
							var token = jwt.sign({data: doc}, process.env.SECRET, {expiresIn: 3600});
							res.status(201).send(token);
						} else {
							res.status(400).send('Password incorrect');
						}
					}
				})				
			} else {
				return res.status(400).send('User doesn\'t exist')
			}
		});
	} else {
		res.status(400).send('Error sending to API');
	}
});

router.post('/register', (req, res)=>{
	if(req.body.name && req.body.password){
		var user = new User();
		user.name = req.body.name;
		user.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
		user.save((err, doc)=>{
			if(err) {
				return res.status(400).send(err);
			} else {
				var token = jwt.sign({data: doc}, process.env.SECRET, {expiresIn: 3600});
				res.status(201).send(token);
			}

		});
	} else {
		res.status(400).send('Error sending to API');
	}
});

module.exports = router;