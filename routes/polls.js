/**
 * Created by suzanne on 11/15/16.
 */
var Poll = require('../models/poll');
var User = require('../models/user');


module.exports = function(app) {


  // =====================================
  // POLL HOME PAGE () ========
  // =====================================
  app.get('/polls', function (req, res) {
    Poll.find({}, function (err, polls) {
      if (err) return console.error(err);
      console.log(polls);
      res.render('pages/polls/index.ejs', {polls: polls}); // load the index.ejs file
    });


  });

  app.get('/poll/new', function (req, res) {
    res.render('pages/polls/add.ejs'); // form to add a new poll
  });

  app.post('/poll/new', function (req, res) {
    var poll = new Poll();
    poll.title = req.body.pollTitle.trim();
    req.body.pollAnswers.split(",").forEach(function (answer) {
      obj = {desc: answer, votes: 0, addedBy: User._id};
      poll.options.push(obj);
    });


    poll.save(function (err, poll) {
      if (err) return console.error(err);
      console.log("Poll saved!");
    });
    res.json(poll + " Saved");

  });

  app.get('/poll/:id', function (req, res) {
    var id = req.params.id;
    Poll.findById({_id: id}, function (err, poll) {
      if (err) return console.error(err);
      console.log(poll);
      //res.json(poll);
      res.render('pages/polls/show.ejs', {poll: poll});
    });

  });

  app.post('/poll/:id', function (req, res) {
    var id = req.params.id;

    newOption = req.body.newOption.trim();
    console.log(typeof(newOption));
    if (newOption !== "") {
      //TODO: add else condition for radio ch
      Poll.findOneAndUpdate({
        _id: id
      }, {
        '$push': {
          options: {
            desc: newOption,
            votes: 1
          }
        }
      }, {
        new: true
      }, function (err, poll) {
        if (err) return console.log(err);
        console.log(poll);
        res.render('pages/polls/show.ejs', {poll: poll});
        //TODO:  place cookie to prevent repeat voting

      })
    }   else {
      console.log(req.body.option);
      var option = req.body.option.trim();
      
      Poll.findOneAndUpdate(
        {_id: id },
        { $inc: {'options.votes': 1} } ,
        {new: true},
        function (err, poll) {
          if (err) return console.log(err);
          console.log(poll);
          res.render('pages/polls/show.ejs', {poll: poll});
          //TODO:  place cookie to prevent repeat voting

      })
    }
  });

  app.get('/results/:id', function (req, res) {
    var id = req.params.id;
    Poll.findById({_id: id}, function (err, poll) {
      if (err) return console.error(err);
      console.log(poll);
      //res.json(poll);
      res.send(poll);
    });

  });

}
