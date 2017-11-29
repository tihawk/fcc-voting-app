const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Poll = require('../models/polls');

router.put('/polls/vote/', (req, res)=>{
	var poll = req.body.poll;
	var votedFor = req.body.votedFor;
	var isUpdated = false;
	for(option of poll.options){
		if(option._id === votedFor._id){
			option.votes++;
			isUpdated = true;
		}
	}
	if(!isUpdated){
		poll.options = poll.options.concat(votedFor);
		isUpdated = true;
	}
	if(isUpdated){
		Poll.findOneAndUpdate({_id: poll._id}, poll, {}, (err, doc)=>{
			if(err){
				res.status(400).send(err);
			} else {
				res.status(200).send(doc);
			}
		})
	}
});

router.get('/polls/:id', (req, res)=>{
	Poll.findOne({_id: req.params.id}, (err, doc)=>{
		if(err){
			res.status(404).send(err);
		} else {
			res.status(200).send(doc);
		}
	});
});

router.put('/polls/:id', (req, res)=>{
	var update = req.body;
	Poll.findOneAndUpdate({_id: req.params.id}, update, {}, (err, doc)=>{
		if(err){
			res.status(400).send(err);
		} else {
			res.status(200).send(doc);
		}
	});
});

router.delete('/polls/:id', (req, res)=>{
	var id = req.params.id;
	Poll.remove({_id: id}, (err, doc)=>{
		if(err){
			res.status(400).send(err);
		} else {
			res.status(200).send(doc);
		}
	})
})

router.get('/polls/user/:userId', (req, res)=>{
	var userId = req.params.userId;
	Poll.find({owner: userId}, (err, doc)=>{
		if(err){
			res.status(404).send(err);
		} else {
			res.status(200).send(doc);
		}
	});
});

router.get('/polls', (req, res)=>{
	Poll.find({}, (err, doc)=>{
		if(err){
			res.status(400).send(err);
		} else {
			res.status(200).send(doc);
		}
	});
});

router.post('/polls', authenticate, (req, res)=>{
	var poll = new Poll();
	poll.name = req.body.name;
	poll.options = req.body.options;
	poll.owner = req.body.owner;

	poll.save((err, doc)=>{
		if(err){
			res.status(400).send(err);
		} else {
			res.status(200).send(doc);
		}
	})
	
});

router.post('/verify_token', (req, res)=>{
	if(req.body.token){
		jwt.verify(req.body.token, process.env.SECRET, (err, decoded)=>{
			if(err){
				res.status(400).send('Invalid token');
			} else {
				res.status(200).send('Valid token');
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

function authenticate(req, res, next){
	if(req.headers.authorization){
		var token = req.headers.authorization.split(' ')[1];
		jwt.verify(token, process.env.SECRET, (err, decoded)=>{
			if(err){
				return res.status(401).send('Invalid token');
			} else {
				next();
			}
		});
	} else {
		return res.status(403).send('No token');
	}
}

module.exports = router;