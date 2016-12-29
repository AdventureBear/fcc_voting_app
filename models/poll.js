// app/models/poll.js
// load the things
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create a schema
var optionsSchema = new Schema({
  desc: String,
  votes: Number,
  addedBy: Schema.Types.ObjectId
});
var votesSchema = new Schema({
  voterID: Schema.Types.ObjectId,
  option: String,
  voterIP: String
});
var pollSchema = new Schema({
  title: {type: String, required: true},
  options: [optionsSchema],
  votes: [votesSchema],
  ownerID: {type: Schema.Types.ObjectId, required: false},
  ownerName: {type: String, required: false}
},{
  timestamps: true
});

var Poll = mongoose.model('Poll', pollSchema);

//make it available
module.exports = Poll;