const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const errorHandler = require('./helpers/error-handler');

// Use mongoose library to set up the database connection with MongoDB.
// We can also use Mongoose to save the data in the database using Mongoose ORM.
const mongoose = require('mongoose'),
  config = process.env.SCALEGRID_URL || process.env.mongolab_url || 'mongodb://localhost:27017/bdc';

let options = {
  useNewUrlParser: true
};

require('./models/users');
require('./models/locations');
require('./models/time');
require('./models/adverts');
require('./models/leftsideadverts');
require('./models/rightsideadverts');
require('./models/baseadverts');
require('./models/currency');
require('./models/rate');
require('./models/bdcoperators');
require('./models/cbnscrapper');
require('./models/contacts');
require('./models/customconverter');



//controllers 
const rtsIndex = require('./routes/index');

mongoose.Promise = global.Promise;
mongoose.connect(config, options).then(
  () => { console.log('Database is connected') },
  err => { console.log('Can not connect to the database' + err) }
);

app.options('*', cors());

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// api routes
app.use('/api', rtsIndex);

// get root 
router.get('/', (req, res) => {
  res.send('OK');
});

// global error handler
app.use(errorHandler);

// start server
const port = process.env.PORT || 5000;

app.listen(port, function () {
  console.log('Listening on port ' + port);
});