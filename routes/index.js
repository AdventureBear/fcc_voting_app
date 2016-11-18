/**
 * Created by suzanne on 11/15/16.
 */
module.exports = function(app,passport){
  require('./users')(app,passport);
  require('./polls')(app);
}