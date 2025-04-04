const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  currentJob: String,
}, { timestamps: true });

module.exports = mongoose.model('Candidate', candidateSchema);
