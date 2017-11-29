const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PollSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	options: [{
		name: {
			type: String,
			required: true
		},
		votes: {
			type: Number,
			default: 0
		}
	}],
	owner: {
		type: String,
		required: true
	}
}, {timestamps: true});

const Poll = mongoose.model('Poll', PollSchema);
module.exports = Poll;