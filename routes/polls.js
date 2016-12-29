/**
 * Created by suzanne on 11/15/16.
 */
var Poll = require('../models/poll');
var User = require('../models/user');


module.exports = function(app, passport) {


  // =====================================
  // POLL HOME PAGE () ========
  // =====================================
  // Everyone should be able to access this route
  app.get('/polls', function (req, res) {
      var name = "";
      var ownersArray = [];
      Poll.find({}, function (err, polls) {
        if (err) return console.error(err);

        polls.forEach(function(poll){
          User.find({
            _id: poll.ownerID
          }, function(err, owners){

            owners.forEach(function(owner) {
              //console.log(poll.title, poll.ownerID, owner[0].google);
              if (owner.google.token) {
                name = owner.google.name.split(" ")[0]
              } else if (owner.facebook.token) {
                name = owner.facebook.name.split(" ")[0]
              } else {
                name = "@" + owner.local.email.split("@")[0]
              }
              console.log(poll.title, poll.ownerID, name);
              ownersArray.push({"id": poll.ownerID, "name": name})
            });


          });


        });


        Poll.find({
          ownerID: req.user_id
        }, function (err, myPolls) {
          if (err) return console.error(err);

          //console.log(polls, myPolls);
          res.render('pages/polls/index.ejs', {
            polls: polls,
            myPolls: myPolls,
            user : req.user,
            owners: ownersArray // get the user out of session and pass to template
          }); // load the index.ejs file
        });
      });

  });

  //Only logged in users should be able to access this route (for now)
  app.get('/poll/user/:id', isLoggedIn, function(req,res){
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

  //Only accessible by logged in users
  app.get('/poll/new', isLoggedIn, function (req, res) {
    res.render('pages/polls/add.ejs', {
      user: req.user
    }); // form to add a new poll
  });

  //Only accessible by logged in users
  app.post('/poll', isLoggedIn, function (req, res) {
    var poll = new Poll();
    poll.title = req.body.pollTitle.trim();  //to trim or not?
    req.body.pollAnswers.split(",").forEach(function (answer) {
      obj = {desc: answer.trim(), votes: 0, addedBy: User._id};
      poll.options.push(obj);
    });
    poll.ownerID = req.user._id;
    poll.ownerName = getNameFromUser(req);

    poll.save(function (err, poll) {
      if (err) return console.error(err);

      var urlString = '/poll/' + poll._id;
      console.log("Poll ", poll._id, " saved, Owner's name: ", poll.ownerName);
      res.render('pages/polls/show.ejs', {
        poll: poll,
        user: req.user
      });
    });
  });

  //Only accessible by logged in users AND
  //Only accessible by owner of poll
  app.delete('/poll/:id', isLoggedIn, function(req,res){
          Poll.remove({
            _id: req.params.id,
            ownerID: req.user._id
          }, function (err, poll) {
            if (err)
              return console.error(err);

            console.log('Poll successfully removed from polls collection!');
            res.status(200).send();


          });

  });


  //All users
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

  //Voting accessible by all
  app.post('/poll/:id', function (req, res) {
    //Log IP address if guest,
    //Log user ID if authenticated
    if (req.isAuthenticated()){
      var voterID = req.user._id;
      var voterIP = null;
    } else{
      var voterID = null;
      var voterIP = req.ip;
    }

    var id = req.params.id;
    //console.log("Logged in? ", isLoggedIn);

      if (req.body.newOption) {

      Poll.findOneAndUpdate({
        _id: id
      }, {
        '$push': {
          options: {
            //desc: newOption,
            desc: req.body.newOption.trim(),
            votes: 1
          },
          votes: {
            voterID: voterID,
            voterIP: voterIP,
            option: req.body.newOption.trim()
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
        Poll.findOneAndUpdate({
            _id: id, 'options.desc': option
          }, {
            $inc: {
              'options.$.votes': 1
            },
            $push: {
              votes: {
                voterID: voterID,
                voterIP: voterIP,
                option: option
              }
            }
          }, {
            new: true
          }, function (err, poll) {
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


  //app.get('/results/:id', function (req, res) {
  //  var id = req.params.id;
  //  Poll.findById({_id: id}, function (err, poll) {
  //    if (err) return console.error(err);
  //    console.log(poll);
  //    //res.json(poll);
  //    res.render('pages/polls/show.ejs', {
  //      poll: poll,
  //      user: req.user
  //    });
  //    //res.send(poll);
  //  });

  //});

};

function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the polls page
  res.redirect('/');
}

function getNameFromUser(req){
  if (req.user.google.token) {
    return req.user.google.name.split(" ")[0];
  } else if (req.user.facebook.token) {
    return req.user.facebook.name.split(" ")[0];
  } else {
    return "@" + req.user.local.email.split("@")[0];
  }
}