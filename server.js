const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

//body parser
const bodyParser = require('body-parser');

//create routes
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');

const app = express();

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Passport configuration
app.use(passport.initialize());
require('./config/passport')(passport);

//db config
const db = require('./config/keys').mongoURI;

//connect to mongo db
mongoose.connect(db).then(() => console.log('Mongo DB connection Successful')).catch(err => console.log('Mongo DB connection failed: ' + err));
//home page
app.get('/', (req, res) => res.send('hello'));

//defining routes in express
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);

const port = 5555;

app.listen(port, () => console.log(`Server running on port ${port}`));
