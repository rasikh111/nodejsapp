// Import the express module
const express = require('express');
const app = express();

// Define a route for the root path
app.get('/', (req, res) => {
  res.send('Hello, Node.js with CI/CD Pipeline! By Muhammad Rasikh Riaz Triggered by successfully github webhook Automation.');
});

// Set the port for the application
const port = 3000;

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

