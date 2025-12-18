const express = require('express');


const path = require('path');
const { Interest, Skill, ExperienceLevel, User, ReportedUrl } = require('./db/index.js')


//init app
const app = express();
const port = 3000;


//MIDDLEWARE:
app.use(express.static(path.resolve(__dirname, '../dist')));
app.use(express.json());
app.use(express.urlencoded());



//ROUTES:

//Base route, link for user to click to sign in w/ google
app.get( '/', (req, res) => {
  res.send('<a href="/auth/google">Authenticate w/ Google</a>')

})

//Protected route (User can't visit this route unless logged in w/ google)
//When a user is logged in we will have access to their details
app.get('/protected', (req, res) => {
  res.send("Hello");

})


// REPORTING:

// Endpoint for READING all reported links.
app.get('/api/reported-links', (req, res) => {
  res.sendStatus(501)
})

// Endpoint for reading a the number of users who have reported a specific link.
  // Used by the client to see if enough users have reported it.
  // Also used by the client to display how many users have reported a link
app.get('/api/reported-links/count', (req, res) => {
  res.sendStatus(501)
})

// Endpoint for reading a specific reported link.
  // this will be used by the client to see if it needs to POST or PATCH the reported link.
  // this will also be used to see if the current user has already reported this link.
app.get('/api/reported-links/:link', (req, res) => {
  res.sendStatus(501)
})

// Endpoint for CREATING a new reported link.
app.post('/api/reported-links', (req, res) => {
  res.sendStatus(501)
})

// Endpoint for ADDING a user to a reported link. 
app.patch('/api/reported-links/:link', (req, res) => {
  res.sendStatus(501)
})

// Endpoint for DELETING a reported link.
  // This should basically only be used by developers for now.
  // This will be really needed if we make a whitelist feature later down the line.
app.delete('/api/reported-links/:link', (req, res) => {
  res.sendStatus(501)
})



app.listen(port, () => {
  console.log(`App is listening on port http://localhost:${port}`);
});
