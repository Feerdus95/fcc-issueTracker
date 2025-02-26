'use strict';

const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');
const path = require('path');
require('dotenv').config();

const apiRoutes         = require('./routes/api.js');
const fccTestingRoutes  = require('./routes/fcctesting.js');
const runner            = require('./test-runner');

let app = express();

// Serve static files from the public directory
app.use('/public', express.static(process.cwd() + '/public'));
// Also serve static files from the root path
app.use(express.static(process.cwd() + '/public'));

app.use(cors({origin: '*'})); //For FCC testing purposes only

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

// Start server for normal operation
const startServer = () => {
  // Get PORT from environment variable for services like Render
  const PORT = process.env.PORT || 3000;
  
  const listener = app.listen(PORT, '0.0.0.0', function () {
    console.log('Your app is listening on port ' + PORT);
    console.log('Environment:', process.env.NODE_ENV || 'development');
  });
  
  return listener;
};

// Only start the server in development, production, or when FORCE_START=true
// This allows us to control server startup in test environments
const isRenderDeploy = process.env.RENDER || false;
if (process.env.NODE_ENV !== 'test' || isRenderDeploy) {
  startServer();
}

// Export the app and startServer function for testing
module.exports = { app, startServer };
