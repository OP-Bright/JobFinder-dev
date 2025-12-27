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
// reports the link of the "current job", since this is just an example it uses "example.com" for every report.
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
// give feedback to the user, telling them they have already reported this link, and that the additional report was not sent.
// ideas: error message like the success feedback.
// button is grayed out and unclickable, but this means that it has to check for the link every time by default.

export default function ReportInputExamples() {
  // const [stateName, setStateFunction] = useState([]);

  const [reportCount, setReportCount] = useState(0); // in theory, this state would be attatched per job.
  const [reportWarning, setReportWarning] = useState(false);
  const [warnMessage, setWarnMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // use this to compare links with the database. returns the then-able promise.
  const getReportedLink = (url) => {
    return axios
      .get("/api/reported-links", url ? { params: { link: url } } : {})
      .catch((err) => {
        console.error(
          `Something went wrong while GETting a report. Url passed in: ${url}`,
          err
        );
      });
  };

  // use this to create a new report if no one has ever reported the link.
  // in the future, it should always just use the currently logged in user, rather than needing a userID passed in.
  const postReport = (url, userID) => {
    return axios
      .post("/api/reported-links", {
        report: {
          url,
          usersReported: [userID],
        },
      })
      .catch((err) => {
        console.error("Something went wrong while making a new report: ", err);
      });
  };

  // use this to add a userID to a prexisting report.
  // in the future, it should always just use the currently logged in user, rather than needing a userID passed in.
  const patchReport = (url, userID) => {
    return axios
      .patch("/api/reported-links", {
        user: userID,
        link: url,
      })
      .catch((err) => {
        console.error(
          "Something went wrong while adding the user to the report: ",
          err
        );
      });
  };

  // checks if the url provided has been reported...
  // displays warning if it has.

  // checks if the link provided has been reported before.
  // if it has,
  // grab the data, and see how many times its been reported, i.e, the length of userIDs.
  // if it's 3 or greater...
  //display a warning, along with the number of users who have reported the link
  // they can still input it but it lets them know.
  // if it has not, it doesn't need to do a thing!
  
  const handleClickOffInput = (inputValue) => {
    getReportedLink(inputValue).then((reportObj) => {
      if(reportObj) {
        if (reportObj.data.usersReported.length >= 3) {
          setReportCount(reportObj.data.usersReported.length);
          setReportWarning(true);
        }
      }
    });
  };

  const handleReportSubmission = (reportedUrl) => {

    // first, it checks if the link has ever been reported...
    getReportedLink(reportedUrl).then((reportObj) => {
      if (reportObj) {
        // if it has...
        if (reportObj.data.usersReported.includes("fakeID-Client")) {
          // has the user already reported it?
          // if so, display a message saying that they have already reported this link.
          setWarnMessage(true);
        } else {
          // if not...
          // make a PATCH request, and send the current userID and related link.
          patchReport("example.com", "fakeID-Client").then(() => {
            // (for this example, the link will always be example.com, but really it would be attatched to the job that the report button is attatched to.)
            // once the request is complete, display the success message.
            setSuccessMessage(true);
          });
        }
      } else {
        // if it has not...
        postReport("example.com", "fakeID-Client").then(() => {
          // make a POST request to post the new report.
          // once the post request has gone through, display the success message.
          setSuccessMessage(true);
        });
      }
    });
  };

  return (
    // the warnings aren't nessecerily exactly as I imagine them to look, but they get across the idea of notifying the user that we have their input.

    <div>
      <div id="jobInputReportingExample">
        <p>Example of a job-input. Will give a warning if you have 3 userIDs stored in the report associated with the inputed link.</p>
        <input
          type="text"
          placeholder="Your jobs link, or location..."
          onBlur={(event) => {
            handleClickOffInput(event.target.value);
          }}
        />
        {reportWarning ? (
          <p id="report-warning-info">
            Are you sure you want to add this job? {reportCount} users have reported this job listing as fraudulent.
          </p>
        ) : (
          <></>
        )}
      </div>
      <div id="ReportButtonExample">
        <p>{'Example of a report button, which would be attatched to a jobListEntry. For the example, the userID is always "fakeID-Client". It always sends a report for "example.com".'}</p>
        <button
          onClick={(event) => {
            handleReportSubmission("example.com");
          }}
        >
          Report Job
        </button>
        {warnMessage ? (
          <p id="report-warning-alreadysent">
            You have already reported this link. Another report was not sent.
          </p>
        ) : (
          <></>
        )}
        {successMessage ? (
          <p id="report-confirm">
            Thanks you for you input! We have saved your report.
          </p>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}