require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 8080;

const app = express();

mongoose.connect(process.env.MONGO_URI);

// set the view engine to ejs
app.set('view engine', 'ejs');

// To support getting mystyles.css (should really filter to /public)
app.use(express.static(path.join(__dirname, 'public')));

const formRouter = require('./routes/form');
app.use('/forms', formRouter);

app.listen(PORT, () => {
    console.log(`App listening on ${PORT}`);
});