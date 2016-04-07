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

  // starting the jar file
  function startJar(run, id) {
    var jar = spawn('java', ['-jar', app.jarPath, run.problem, run.generations, run.population, run.tournamentSize, run.crossovers, run.mutations]);

    var generationIndex = 0;

    jar.stdout.on('data', function(data) {
      var formattedData = "" + data;
      console.log(formattedData);

      if (formattedData.indexOf("ID") > -1) {
        formattedData = formattedData.replace("\r","");
        formattedData = formattedData.split("\n");

        var solutionArray = [];
        for (var i=0; i<formattedData.length; i++) {
          if (formattedData[i].indexOf("Machine") > -1) {
            var machine = formattedData[i].split('\t');
            for (var j=0; j<machine.length; j++) {
              if (isNaN(parseInt(machine[j]))) {
                machine.splice(j,1);
              }
            }
            solutionArray.push(machine);
          }
        }
        solutionArray.splice(0,1);
        console.log("formattedData: ");
        console.log(solutionArray);
      }

      // check for the wanted output line
      if (formattedData.indexOf("JSSP: ") > -1) {
        var resultObj = formattedData.replace("JSSP: ", "");
        resultObj = resultObj.split(",");
        var generation = parseInt(resultObj[0].replace("generation-", ""));
        if (generation == generationIndex && generationIndex != 0) return;
        var fitness = parseInt(resultObj[1].replace("fitness-", ""));

        resultObj = {generation: generation, fitness: fitness};

        Run.findOne({
          _id: id
        }, function(err, foundRun) {
          if (err) return;

          if (!foundRun.results) foundRun.results = [];
          foundRun.results.push(resultObj)

          generationIndex ++;

          if (generationIndex == foundRun.generations - 1)
            app.io.emit('jar-finished', "No more data");
          app.io.emit('jar-data', foundRun.results);
        })
      }

    });

    jar.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
    });
  }

  return function(req, res, next) {
    next();
  };
}
