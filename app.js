const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const Candidate = require('./models/Candidate');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Get Mongo credentials and host from env (Kubernetes will inject these)
const mongoUser = process.env.MONGO_INITDB_ROOT_USERNAME;
const mongoPass = process.env.MONGO_INITDB_ROOT_PASSWORD;
const mongoHost = process.env.MONGO_HOST || 'mongo-service';
const mongoDB   = process.env.MONGO_DB || 'candidateDB';

// Build connection URI
const mongoURI = `mongodb://${mongoUser}:${mongoPass}@${mongoHost}:27017/${mongoDB}?authSource=admin`;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB connection error:', err));

// Serve the HTML form
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'form.html'));
});

// Handle form submissions
app.post('/submit', async (req, res) => {
  try {
    const { name, mobile, email, currentJob } = req.body;
    const candidate = new Candidate({ name, mobile, email, currentJob });
    await candidate.save();
    res.send('<h2>✅ Candidate submitted successfully!</h2>');
  } catch (err) {
    console.error('❌ Error saving candidate:', err);
    res.status(500).send('<h2>❌ Failed to submit candidate data.</h2>');
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 App running on port ${PORT}`));
