var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ClubSchema   = new Schema({
	title: String,
	city: String,
	photo: { type: String, default: '' }
});

module.exports = mongoose.model('Club', ClubSchema);
