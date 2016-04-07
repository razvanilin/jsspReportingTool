var mongoose = require('mongoose');
var util = require('util');
var spawn = require('child_process').spawn;

module.exports = function(app, route) {

  var Run = mongoose.model("Run", app.models.run);

  app.post("/run", function(req, res) {
    if (!req.body.run) return res.status(400).send("Invalid form.");

    Run.collection.insert(req.body.run, function(error, run) {
      if (error) {
        console.log(error);
        return res.status(400).send("Error creating the entry in the database.");
      }
      startJar(req.body.run, run.ops[0]._id);

      return res.status(201).send(run.ops[0]);
    });
  });


  app.get("/run", function(req, res) {
    Run.find({}, function(err, runs) {
      if (err) return res.status(400).send("Error with the request.");
      if (!runs) return res.status(200).send("Database is empty");

      return res.status(200).send(runs);
    });
  });

  // starting the jar file
  function startJar(run, id) {
    var jar = spawn('java', ['-jar', app.jarPath, run.problem, run.generations, run.population, run.tournamentSize, run.crossovers, run.mutations]);

    var generationIndex = 0;
    var results = [];
    jar.stdout.on('data', function(data) {
      var formattedData = "" + data;
      console.log(formattedData);

      // check for the wanted output line
      if (formattedData.indexOf("JSSP: ") > -1) {
        var resultObj = formattedData.replace("JSSP: ", "");
        resultObj = resultObj.split("-");
        var generation = parseInt(resultObj[0].replace("generation ", ""));
        //if (generation == generationIndex && generationIndex != 0) return;
        var fitness = parseInt(resultObj[1].replace("fitness ", ""));
        var solution = resultObj[2].replace("solution ", "");

        resultObj = {generation: generation, fitness: fitness, solution: solution};

        Run.findOne({
          _id: id
        }, function(err, foundRun) {
          if (err) return;

          if (!foundRun.results) foundRun.results = [];
          foundRun.results.push(resultObj)
          results.push(resultObj);


          generationIndex ++;

          if (generationIndex == foundRun.generations) {
            app.io.emit('jar-finished', foundRun.results);
            foundRun.results = results;
            foundRun.save(function(err) {
              if (err) console.log(err);
              results = [];
            });
          } else {
            app.io.emit('jar-data', foundRun.results);
          }
        });
      }

    });

    jar.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });

    // kill the process on signal
    app.socket.on('jar-stop', function() {
      jar.kill();
    });
  }

  return function(req, res, next) {
    next();
  };
}
