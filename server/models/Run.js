var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

// Create a Test schema
var RunSchema = new mongoose.Schema({
  problem: {
    type: Number
  },
  generations: {
    type: Number
  },
  population: {
    type: Number
  },
  tournamentSize: {
    type: Number
  },
  crossovers: {
    type: Number
  },
  mutations: {
    type: Number
  },
  time: {
    type: String
  },
  results: [{
    generation: {
      type: Number
    },
    fitness: {
      type: Number
    },
    solution: {
      type: String
    }
  }]
});

RunSchema.plugin(timestamps);

// Export the schema
module.exports = RunSchema;
