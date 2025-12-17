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



app.listen(port, () => {
  console.log(`App is listening on port http://localhost:${port}`);
});
