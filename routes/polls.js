/**
 * Created by suzanne on 11/15/16.
 */
var Poll = require('../models/poll');
var User = require('../models/user');

module.exports = function(app) {


  // =====================================
  // POLL HOME PAGE () ========
  // =====================================
  app.get('/polls', function(req, res) {
    Poll.find({}, function(err,polls){
      if (err) return console.error(err);
      console.log(polls);
      res.render('pages/polls/index.ejs', {polls: polls }); // load the index.ejs file
    });



  });

  app.get('/poll/new', function(req, res) {



    res.render('pages/polls/add.ejs'); // form to add a new poll
  });

  app.post('/poll/new', function(req, res) {
    var poll = new Poll();
    poll.title = req.body.pollTitle.trim();
     req.body.pollAnswers.split(",").forEach(function(answer){
       obj = {desc: answer, votes: 0, addedBy: User._id};
       poll.options.push(obj);
     });


    poll.save(function (err, poll) {
      if (err) return console.error(err);
      console.log("Poll saved!");
    });

    //console.log(req.body);
    res.json(poll + " Saved");

  });


}