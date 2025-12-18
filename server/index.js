const express = require("express");
const axios = require("axios");

const dotenv = require("dotenv/config");
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

//Base route, link for user to click to sign in w/ google
app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate w/ Google</a>');
});

//Protected route (User can't visit this route unless logged in w/ google)
//When a user is logged in we will have access to their details
app.get("/protected", (req, res) => {
  res.send("Hello");
});

// route to allow client to make GET request using /findjobs/:category endpoint
// will send back default job list for now
app.get("/findjobs{/:category}", (req, res) => {
  const { category } = req.params;
  // only want 8 job results for now (will probably change)
  const results_per_page = 8;
  // if category parameter is not defined send client default job listings
  if (!category) {
    axios
      .get("http://api.adzuna.com/v1/api/jobs/us/search/1", {
        params: {
          app_id,
          app_key,
          results_per_page,
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
  }
});

// REPORTING:

// Endpoint for READING all reported links.
app.get('/api/reported-links', (req, res) => {
  ReportedUrl.find({}).then((urls) => {
    res.status(200).send(urls);
  }).catch((err) => {
    console.error('Failed to find reported URLs: ', err);
    res.sendStatus(500);
  })
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


// Start the Server. All endpoints should go above this.
app.listen(port, () => {
  console.log(`App is listening on port http://localhost:${port}`);
});
