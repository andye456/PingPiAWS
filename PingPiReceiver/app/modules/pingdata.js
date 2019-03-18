// This defines the expected data format that is returned from the Mongo db.

// { date: '2015:08:03:22:11:01',
//   outcome: 'success',
//   time: 16 }

var mongoose = require('mongoose');

var schema = new mongoose.Schema({ date: String, outcome: String, time: Number },{ collection: 'pingdata' });
module.exports = mongoose.model('pingdata', schema);
