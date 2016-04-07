var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');

// Create a Test schema
var TestSchema = new mongoose.Schema({
  message: {
    type: String,
    required:true
  },
  mood: {
    type: String
  }
});

TestSchema.plugin(timestamps);

// Export the schema
module.exports = TestSchema;
