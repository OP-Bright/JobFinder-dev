import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

// GOAL OF THIS FILE:

// get an example of the clientside functionality needed for the inputs to detect if the link has been reported.
// get an example of buttons to report a job. They should give feedback if it worked, or if you already reported the website.

// INPUT:
// allows you to put in a link
// once you click off, it checks if the link provided has been reported before.
// if it has, grab the data, and see how many times its been reported, i.e, the length of userIDs. 
// if it's 3 or greater, display a warning, along with the number of users who have reported the link
// they can still input it but it lets them know.

// BUTTON
// reports the link of the "current job", since this is just an example it uses a default one.
// FIRST, it checks if the current userID is on this link...
// If it's not...
  // did it actually find the link when it checked for it?
  // If so...
    // adds the current userID to the usersReported of the link.
    // give some feedback to the user that their report has been stored.
  // If not...
    // posts the link along with the current userID
    // gives some feedback to the user that their report has been stored.
// If the user HAS already reported the link...
  // give feedback to the user, telling them they have already reported this link.
  // ideas: error message like the success feedback.
  // button is grayed out and unclickable, but this means that it has to check for the link every time by default.

export default function reportInputExamples() {
  const [stateName, setStateFunction] = useState([]);

  const getData = (category) => {
    axios
      .get(/* url */)
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error("template failure message: ", err);
      });
  };

  return (<div>
    <p>placeholder</p>
  </div>)
}