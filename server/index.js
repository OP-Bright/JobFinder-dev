const express = require("express");
const passport = require("passport")
const axios = require("axios");


const dotenv = require("dotenv/config");
require('./auth.js')
const { app_id, app_key } = process.env;

const path = require("path");
const {
  Interest,
  Skill,
  ExperienceLevel,
  User,
  ReportedUrl,
} = require("./db/index.js");

//init app
const app = express();
const port = 3000;

//MIDDLEWARE:
app.use(express.static(path.resolve(__dirname, "../dist")));
app.use(express.json());
app.use(express.urlencoded());

//ROUTES:

//Base sign in route, link for user to click to sign in w/ google
app.get('/signin', (req, res) => {
  res.send('<a href="/auth/google">Authenticate w/ Google</a>');
});

//when someone visits this link they should be authenticated w/ google.
app.get('/auth/google',
  passport.authenticate('google', {scope: ['email', 'profile']})

)

//Protected route (User can't visit this route unless logged in w/ google)
//When a user is logged in we will have access to their details
app.get("/protected", (req, res) => {
  res.send("Hello");
});

// route to allow client to make GET request using /findjobs/:category endpoint
// will send back default job list for now
app.get("/findjobs{/:category}", (req, res) => {
  const { category } = req.params;
  const results_per_page = 50
  // if category parameter is not defined send client default job listings
  axios
    .get("http://api.adzuna.com/v1/api/jobs/us/search/1", {
      params: {
        app_id,
        app_key,
        results_per_page,
        category: category || "",
      },
    })
    .then((jobs) => {
      const jobsArray = jobs.data.results;
      res.status(200).send(jobsArray);
    })
    .catch((err) => {
      res.sendStatus(500);
      console.error("Failed to GET jobs", err);
    });

});

// REPORTING:

// Endpoint for READING reported links.
// If it receives a request with a specific link, it will instead just return the details of that one.
// Example of the above: http://localhost:3000/api/reported-links/?link=www.google.com/whatever, link = 'www.google.com/whatever'
// If it does not have a link query specified, it will give the entire ReportedLink array.
app.get('/api/reported-links', (req, res) => {
  if (req.query.link) { // if there is a link provided....
    // find the URL that matches
    ReportedUrl.find({ url: req.query.link }).then((url) => {
      if (url.length === 0) { // if it didn't find anything, then it was not found.
        res.sendStatus(404);
      } else { // if it did find something, send all of the details about that URL. (The same URL should never get added by the client.)
        res.status(200).send(url[0]);
      }
    }).catch((err) => { // Error Handling
      console.error('Failed to find specific reported URL: ', err);
      res.sendStatus(500);
    })
  } else { // if no link was provided
    ReportedUrl.find({}).then((urls) => { // get all the documents
      res.status(200).send(urls); // send all the details of all the documents
    }).catch((err) => { //error handling
      console.error('Failed to find reported URLs: ', err);
      res.sendStatus(500);
    })
  }
})

// Endpoint for CREATING a new reported link.
// this should only be used by the client if it did not find a match for the current link.
// request body should have a report property, that contains an object as such...
// {url: 'url', usersReported: [userId]};
app.post('/api/reported-links', (req, res) => {
  ReportedUrl.create(req.body.report).then(() => { //create the new report!
    res.sendStatus(201);
  }).catch((err) => { // error handling
    console.error("There was a problem during link report creation: ", err);
    res.sendStatus(500);
  })
})

// Endpoint for ADDING a user to a reported link. 
// if the link has already been found by the client to be in our list of reported links, then use this to add the current user to the list of reported users.
// request body should have a user property which contains the userID, and a link property which contains the link that is being updated.
// this function will find the current state of the reported link, and add the user to the usersReported array. This ensures that the client doesn't need to re-insert ALL previous users.
// Should not add duplicate users, if the userID is already in the array, do not add it again.
app.patch('/api/reported-links', (req, res) => {
  // Note, this can cause some serious errors if used on links that have not yet been added to the database. 
  // Make sure the client checks that the link is in the database before updating. If it's not, post, don't patch!
  ReportedUrl.find({ url: req.body.link }).then((url) => { // find the specific url...
    if (url[0].usersReported.includes(req.body.user)) { // if the user has already reported this site...
      res.sendStatus(409); // there is a conflict! State as such.
    } else { // if they have not...
      const updatedUsers = url.usersReported;
      updatedUsers.push(req.body.user); // create a new version of the array with the user added
      return ReportedUrl.updateOne({ _id: url._id }, { usersReported: updatedUsers }).then(() => { // change the array to include the user!
        res.sendStatus(200);
      })
    }
  }).catch((err) => { //error handling
    console.error('An issue occured while finding or updating the provided URL: ', err);
    res.sendStatus(500);
  })
})

// Endpoint for DELETING a reported link.
// This should basically only be used by developers for now.
// This will be really needed if we make a whitelist feature later down the line.
// provide the ID of a url in the database in the query, and the request will remove it. If you're deleting it, you must know it exists, which means that you likely have access to the id.
app.delete('/api/reported-links', (req, res) => {
  ReportedUrl.findByIdAndDelete(req.query.urlId).then(() => {
    res.sendStatus(200);
  }).catch((err) => {
    console.error("A problem occured while deleting the reported link: ", err);
  })
})


// Start the Server. All endpoints should go above this.
app.listen(port, () => {
  console.log(`App is listening on port http://localhost:${port}`);
});
