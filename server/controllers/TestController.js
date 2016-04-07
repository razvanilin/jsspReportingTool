var mongoose = require('mongoose');

module.exports = function(app, route) {
  var Test = mongoose.model('test', app.models.test)

  // test route. Get all the messages
  app.get('/test', function(req, res, next) {
    Test.find({}, function(err, tests) {
      // if there is an error with the query, send a 400 along with the error message
      if (err) return res.status(400).send(err);

      // else if there are no tests in the database, send the message below
      else if (tests.length == 0) {
        return res.status(200).json([{
            message: "Hello, mean-gen database is empty. Try to Post Something.",
            mood: "Enthusiastic"
          }]
        );
      }

      // otherwise send the full list of tests
      return res.status(200).send(tests);
    });

  });

  // test post
  app.post('/test', function(req, res, next) {
    // insert the request body inside the Test collection
    Test.collection.insert(req.body, function(error, data) {
      // send a 400 if there was an error with the POST
      if (error) return res.status(400).send(error);
      //otherwise send a 200 with a successfull message
      return res.status(200).send('POST successfull');
    });
  });

  // return the middleware
  return function(req, res, next) {
    next();
  };
};
