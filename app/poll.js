/**
 * Created by suzanne on 11/11/16.
 */
var Poll = require('././poll.js');

var user = {
  name: "Suzanne",
  id: 3
};

//create a new user
var myPoll = new Poll({
  owner: user.id,
  title: 'What kind of Dog Breed',
  options: [
    {desc: "Border Collie", votes: 0},
    {desc: "Collie", votes: 2},
    {desc: "AussieDoodle", votes: 1}
  ]
});

console.log(myPoll);

myPoll.save(function(err) {
  if (err) throw err;
  console.log('Poll saved successfully');
})
