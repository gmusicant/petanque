var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
	
	username: { type: String, default: '' },
	firstName: { type: String, default: '' },
	lastName: { type: String, default: '' },
	
	gender: { type: Number, default: 0, min: 0, max: 3 }, // allowed 0 - unknown 1 - man 2 - woman
	clubId: { type: String, default: '' },
	photo: { type: String, default: '' },

	registrationId: { type: Number, default: 0 },
	registrationExpireAt: { type: Date, default: 0 },
	registrationStartAt: { type: Date, default: 0 },

	updateDate: { type: Date, default: 0 },
	createDate: { type: Date, default: Date.now }
	
});

UserSchema.post('init', function (doc) {
	
	if (!doc.registrationExpireAt)
		doc.registrationExpireAt = '';
	else {
		
		if (typeof doc.registrationExpireAt == 'object' && doc.registrationExpireAt.getTime() == 0)
			doc.registrationExpireAt = '';
		
	}
	
	if (!doc.registrationStartAt)
		doc.registrationStartAt = '';
	else {
						
		if (typeof doc.registrationStartAt == 'object' && doc.registrationStartAt.getTime() == 0)
			doc.registrationStartAt = '';
		
	}  

});


var User = mongoose.model('User', UserSchema);
	
module.exports = User;
