const express = require("express");
const session = require("express-session");
const passport = require("passport");
const axios = require("axios");
const path = require("path");
const dotenv = require("dotenv/config");

require("./auth.js");

const { app_id, app_key } = process.env;
const { secret } = process.env;

const {
  Preference,
  SuggestedPreference,
  User,
  ReportedUrl,
} = require("./db/index.js");
const { error } = require("console");

//init app
const app = express();
const port = 3000;

//check if the user is already logged in
function isLoggedIn(req, res, next) {
  //check if req has a user
  //if it does, move to next middleware fn
  //if not return 401 (unauthorized)
  req.user ? next() : res.sendStatus(401);
}

//MIDDLEWARE:
app.use(express.static(path.resolve(__dirname, "../dist")));
app.use(express.json());

app.use(
  session({
    secret: secret,
    resave: false, //don't save session if nothing is modified
    saveUninitialized: false, //don't create session until something is stored
  })
); //need to define deprecated points

app.use(passport.initialize());
app.use(express.urlencoded());
app.use(passport.session());

//ROUTES:

//when someone visits this link they should be authenticated w/ google.
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email']})//scope of what ever is included in the profile
)

//when someone is authenticated and signs in
app.get(
  "/google/callback",
  passport.authenticate("google", {
    //the url we bring the user to if they are successfully authenticated.
    successRedirect: "/protected",
    //if not successful
    failureRedirect: "/auth/failure",
  })
);

//define endpoint for failureRedirect
app.get("/auth/failure", (req, res) => {
  res.send("Something didn't go as planned, please check credentials");
});

//Protected route (User can't visit this route unless logged in w/ google)
//When a user is logged in we will have access to their details
app.get("/protected", isLoggedIn, (req, res) => {
  res.send(`Hello ${req.user.displayName}`); //explore what other info from the req I can use
});

//Logout route
app.get("/logout", (req, res) => {
  req.logout();
  //destroy current session
  req.session.destroy();
  res.send('You are logged out')
  res.redirect('/signin')
});

// Preferences API Routes:

// route to allow client to make GET request using /findjobs/:category endpoint
// will send back default job list for now
app.get("/api/findjobs{/:category}", (req, res) => {
  const { category } = req.params;
  const results_per_page = 50;
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

// endpoint allows client to input suggested preferences to database for admin review
app.post("/api/findjobs", (req, res) => {
  const { name } = req.body;
  SuggestedPreference.create({
    name,
  })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((err) => {
      console.error(err);
      // want to make a custom error message if input fails to save to database
      // so that i can use the error type for the client side
      if (err.name === "ValidationError") {
        let errorsObj = {};
        // make err object's "errors" property
        // (which is an object) into an array
        // of error type keys to use for output "errorsObj"
        Object.keys(err.errors).forEach((key) => {
          errorsObj[key] = err.errors[key].kind;
        });
        // send custom error obj to client for
        // further custom error handling logic
        return res.status(400).send(errorsObj);
      }
      // MISC error handling
      res.status(500).send("Something Went Wrong");
    });
});

// // endpoint allows user to update preferences and save new preference options in the database (WIP)
app.patch("/api/update-preferences", (req, res) => {});

// endpoint for admins to delete from list of approved preferences via Postman
// to see list of current preferences stored in database: send DELETE request to /api/delete-preferences (no id)
// to delete a preference stored in database: send DELETE request with id specified. Example: http://localhost:3000/api/delete-preferences/(id goes here)"
app.delete("/api/delete-preferences{/:id}", async (req, res) => {
  const { id } = req.params;
  // should retrieve current list of approved preferences from database
  // variable used to store the list or the error message, to be shown to admin
  const prefsBeforeDelete = await Preference.find().catch((err) => {
    return `Failed to retrieve current preferences list. Error: ${err}`;
  });

  // check if id exists, if not sent back current preferences list
  if (!id) {
    res.status(200).send({
      message:
        "Hello Admin, to remove a preference, copy its ID value then resend DELETE Request with the ID as a Request parameter. (Example: http://localhost:3000/api/delete-preferences/(id goes here)",
      preferences: prefsBeforeDelete,
    });
  } else {
    Preference.findByIdAndDelete(id)
      .then(async (deletedPrefObj) => {
        // the name of the preference being deleted
        const deletedPrefName = deletedPrefObj.name;
        // the variable that contains the preferences list after delete operation is successful
        // or the error message, containing the reason why the list failed to be retrieved.
        const prefsAfterDelete = await Preference.find().catch((err) => {
          return `Failed to retrieve current preferences list. Error: ${err}`;
        });
        // send admin confirmation msg with status code, including database state before and after the delete operation
        res.status(200).send({
          message: `Successfully deleted document associated with the (${deletedPrefName}) preference.`,
          "preferences-before": prefsBeforeDelete,
          "preferences-now": prefsAfterDelete,
        });
      })
      .catch((err) => {
        // send admin error message if preference fails to delete, common reason provided.
        res.status(500).send(`Failed to DELETE preference. Preference may have been deleted or does not exist, further investigation required. 
          Error: "${err}"`)
      });
  }
});

// REPORTING:

// Endpoint for READING reported links.
// If it receives a request with a specific link, it will instead just return the details of that one.
// Example of the above: http://localhost:3000/api/reported-links/?link=www.google.com/whatever, link = 'www.google.com/whatever'
// If it does not have a link query specified, it will give the entire ReportedLink array.
app.get("/api/reported-links", (req, res) => {
  if (req.query.link) {
    // if there is a link provided....
    // find the URL that matches
    ReportedUrl.find({ url: req.query.link })
      .then((url) => {
        if (url.length === 0) {
          // if it didn't find anything, then it was not found.
          res.sendStatus(404);
        } else {
          // if it did find something, send all of the details about that URL. (The same URL should never get added by the client.)
          res.status(200).send(url[0]);
        }
      })
      .catch((err) => {
        // Error Handling
        console.error("Failed to find specific reported URL: ", err);
        res.sendStatus(500);
      });
  } else {
    // if no link was provided
    ReportedUrl.find({})
      .then((urls) => {
        // get all the documents
        res.status(200).send(urls); // send all the details of all the documents
      })
      .catch((err) => {
        //error handling
        console.error("Failed to find reported URLs: ", err);
        res.sendStatus(500);
      });
  }
});

// Endpoint for CREATING a new reported link.
// this should only be used by the client if it did not find a match for the current link.
// request body should have a report property, that contains an object as such...
// {url: 'url', usersReported: [userId]};
app.post("/api/reported-links", (req, res) => {
  ReportedUrl.create(req.body.report)
    .then(() => {
      //create the new report!
      res.sendStatus(201);
    })
    .catch((err) => {
      // error handling
      console.error("There was a problem during link report creation: ", err);
      res.sendStatus(500);
    });
});

// Endpoint for ADDING a user to a reported link.
// if the link has already been found by the client to be in our list of reported links, then use this to add the current user to the list of reported users.
// request body should have a user property which contains the userID, and a link property which contains the link that is being updated.
// this function will find the current state of the reported link, and add the user to the usersReported array. This ensures that the client doesn't need to re-insert ALL previous users.
// Should not add duplicate users, if the userID is already in the array, do not add it again.
app.patch("/api/reported-links", (req, res) => {
  // Note, this can cause some serious errors if used on links that have not yet been added to the database.
  // Make sure the client checks that the link is in the database before updating. If it's not, post, don't patch!
  ReportedUrl.find({ url: req.body.link })
    .then((url) => {
      // find the specific url...
      if (url[0].usersReported.includes(req.body.user)) {
        // if the user has already reported this site...
        res.sendStatus(409); // there is a conflict! State as such.
      } else {
        // if they have not...
        const updatedUsers = url[0].usersReported;
        updatedUsers.push(req.body.user); // create a new version of the array with the user added
        return ReportedUrl.updateOne(
          { _id: url[0]._id },
          { usersReported: updatedUsers }
        ).then(() => {
          // change the array to include the user!
          res.sendStatus(200);
        });
      }
    })
    .catch((err) => {
      //error handling
      console.error(
        "An issue occured while finding or updating the provided URL: ",
        err
      );
      res.sendStatus(500);
    });
});

// Endpoint for DELETING a reported link.
// This should basically only be used by developers for now.
// This will be really needed if we make a whitelist feature later down the line.
// provide the ID of a url in the database in the query, and the request will remove it. If you're deleting it, you must know it exists, which means that you likely have access to the id.
app.delete("/api/reported-links", (req, res) => {
  ReportedUrl.findByIdAndDelete(req.query.urlId)
    .then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.error(
        "A problem occured while deleting the reported link: ",
        err
      );
    });
});

// catch all route to allow react router to take control of routing (said to be best placed after all api routes)
app.get("/*any", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../dist", "index.html"));
});

// Start the Server. All endpoints should go above this.
app.listen(port, () => {
  console.log(`App is listening on port http://localhost:${port}`);
});
