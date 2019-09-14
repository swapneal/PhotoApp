const express = require('express');
const mongoose = require('mongoose');

//create routes
const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const profile = require('./routes/api/profile');

//body parser
const bodyParser = require('body-parser');

//db config
const db = require('./config/keys').mongoURI;

const app = express();

//connect to mongo db
mongoose.connect(db).then(() => console.log('Mongo DB connection Successful')).catch(err => console.log('Mongo DB connection failed: ' + err));

//body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//home page
app.get('/', (req, res) => res.send('hello'));

//defining routes in express
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/profile', profile);

const post = 5555;

app.listen(port, () => console.log(`Server running on port ${port}`));
