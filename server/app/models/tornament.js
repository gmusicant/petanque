var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TornamentSchema   = new Schema({
	title: String,
	description: {type: String, default: ''},
	type: {type: Number, default: 0},
	photo: {type: String, default: ''},
	organizator: {
		firstName: {type: String, default: ''},
		lastName: {type: String, default: ''},
		userId: {type: String, default: ''}
	},
	// ?
	invitation: {type: String, default: ''},
	startDate: Date,
	registrationTillDate: Date,
	inscriptionDate: Date,
	location: {
		country: {type: String, default: ''},
		city: {type: String, default: ''},
		address: {type: String, default: ''}
	},
	// member should pay
	price: {type: Number, default: 0},
	// USD, EUR, UAH..
	currency: {type: String, default: ''},
	// winner can win
	prize: {type: Number, default: 0},
	results: [{
		user: {
			firstName: String,
			lastName: String,
			userId: {type: String, default: ''},
			club: {
				title: {type: String, default: ''},
				city: {type: String, default: ''},
				photo: {type: String, default: ''},
				clubId: {type: String, default: ''}
			}
		},
		score: {type: Number, default: 0},
		position: {type: Number, default: 0},
		prize: {type: Number, default: 0}
	}],
	createDate: {type: Date, default: Date.now},
	updateDate: Date
});

module.exports = mongoose.model('Tornament', TornamentSchema);
