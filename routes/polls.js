/**
 * Created by suzanne on 11/15/16.
 */
var Poll = require('../models/poll');
var User = require('../models/user');


module.exports = function(app, passport) {


  // =====================================
  // POLL HOME PAGE () ========
  // =====================================
  app.get('/polls', function (req, res) {

      Poll.find({}, function (err, polls) {
        if (err) return console.error(err);

        Poll.find({
          ownerID: req.user_id
        }, function (err, myPolls) {
          if (err) return console.error(err);

          console.log(polls, myPolls);
          res.render('pages/polls/index.ejs', {
            polls: polls,
            myPolls: myPolls,
            user : req.user  // get the user out of session and pass to template
          }); // load the index.ejs file
        });
      });
  });

  app.get('/poll/user/:id', function(req,res){
    console.log(req.params.id);

    Poll.find({
      ownerID:  req.params.id
    }, function (err, polls) {
      if (err) return console.error(err);
      res.render('pages/polls/index.ejs', {
        polls: polls,
        user : req.user  // get the user out of session and pass to template
      }); // load the index.ejs file
    });
  });


  app.get('/poll/new', isLoggedIn, function (req, res) {
    res.render('pages/polls/add.ejs', {
      user: req.user
    }); // form to add a new poll
  });



  //app.post('/poll/new', function (req, res) {
  //  var poll = new Poll();
  //  poll.title = req.body.pollTitle.trim();  //to trim or not?
  //  req.body.pollAnswers.split(",").forEach(function (answer) {
  //    obj = {desc: answer.trim(), votes: 0, addedBy: User._id};
  //    poll.options.push(obj);
  //  });
  //  poll.ownerID = req.user._id;
  //
  //  poll.save(function (err, poll) {
  //    if (err) return console.error(err);
  //    console.log("Poll saved!");
  //  });
  //
  //  res.redirect('/polls', {
  //    poll: poll,
  //    user: req.user
  //  });
  //  res.json(poll + " Saved");
  //
  //});

  app.post('/poll', function (req, res) {
    var poll = new Poll();
    poll.title = req.body.pollTitle.trim();  //to trim or not?
    req.body.pollAnswers.split(",").forEach(function (answer) {
      obj = {desc: answer.trim(), votes: 0, addedBy: User._id};
      poll.options.push(obj);
    });
    poll.ownerID = req.user._id;

    poll.save(function (err, poll) {
      if (err) return console.error(err);

      var urlString = '/poll/' + poll._id;
      console.log("Poll ", poll._id, " saved!");
      res.render('pages/polls/show.ejs', {
        poll: poll,
        user: req.user
      });
    });

    //res.redirect(200, '/poll'+ newID, {
    //     poll: poll,
    //      user: req.user
    //    });
    //res.json(poll + " Saved");

  });

  app.delete('/poll/:id', function(req,res){
    //var id = req.params.id;
    Poll.remove({
      _id: req.params.id
    }, function(err, poll){
      if (err)
        return console.error(err);

      console.log('Poll successfully removed from polls collection!');
      res.status(200).send();


      });
  });



  app.get('/poll/:id', function (req, res) {
    var id = req.params.id;
    Poll.findById({_id: id}, function (err, poll) {
      if (err) return console.error(err);
      console.log(poll);
      //res.json(poll);
      res.render('pages/polls/show.ejs', {
        poll: poll,
        user: req.user
      });
    });

  });

  app.post('/poll/:id', function (req, res) {
    var id = req.params.id;
    console.log("Logged in? ", isLoggedIn);

      if (req.body.newOption) {

      Poll.findOneAndUpdate({
        _id: id
      }, {
        '$push': {
          options: {
            //desc: newOption,
            desc: req.body.newOption.trim(),
            votes: 1
          }
        }
      }, {
        new: true
      }, function (err, poll) {
        if (err) return console.log(err);
        console.log(poll);
        res.render('pages/polls/show.ejs', {
          user: req.user,
          poll: poll
        });
        //TODO:  place cookie to prevent repeat voting

      })
    }   else if (req.body.option) {
        var option = req.body.option.trim();
        Poll.findOneAndUpdate(
          {_id: id, 'options.desc': option},
          {$inc: {'options.$.votes': 1}},
          {new: true},
          function (err, poll) {
            if (err) return console.log(err);
            console.log("Poll: ", poll);
            res.render('pages/polls/show.ejs', {
              poll: poll,
              user: req.user
            });
            //TODO:  place cookie to prevent repeat voting
          })
      }  else {
      res.redirect('/poll/'+ id);
    }

  });

  app.get('/results/:id', function (req, res) {
    var id = req.params.id;
    Poll.findById({_id: id}, function (err, poll) {
      if (err) return console.error(err);
      console.log(poll);
      //res.json(poll);
      res.render('pages/polls/show.ejs', {
        poll: poll,
        user: req.user
      });
      //res.send(poll);
    });

  });

};

function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the polls page
  res.redirect('/');
}