'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');
require('dotenv').config();

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

let app = express();

app.use('/public', express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'}));  // For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Add route for API usage page first (specific routes before wildcards)
app.route('/usage')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/usage.html');
  });

// Add specific route for /issues/:project to match the links in the HTML
app.route('/issues/:project')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

// Generic project route (should come after specific routes)
app.route('/:project/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/issue.html');
  });

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

// Simple server startup function without conditional logic
const startServer = (port) => {
  // Use PORT env variable or default to 3000
  const PORT = port || process.env.PORT || 3000;
  
  return app.listen(PORT, function() {
    console.log('Listening on port ' + PORT);
  });
};

// For testing
if (process.env.NODE_ENV === 'test') {
  // Don't start the server automatically in test mode - tests will call startServer
  console.log('Test environment - server will be started by tests');
} else {
  // In development and production, start the server automatically
  startServer();
}

module.exports = { app, startServer };
