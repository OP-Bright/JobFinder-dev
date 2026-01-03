import React from "react"

// We would not need this normally, but we need it to adapt based on report input.
import { useState } from "react";
import axios from "axios";

//accepts job prop from statusSection
export default function JobListEntry ({job, currentUser}){

  // REPORTING STUFF
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

    const handleReportSubmission = (reportedUrl) => {

      // first, it checks if the link has ever been reported...
      getReportedLink(reportedUrl).then((reportObj) => {
        if (reportObj) {
          // if it has...
          if (reportObj.data.usersReported.includes(currentUser._id)) {
            // has the user already reported it?
            // if so, display a message saying that they have already reported this link.
            setWarnMessage(true);
            setSuccessMessage(false);
          } else {
            // if not...
            // make a PATCH request, and send the current userID and related link.
            patchReport(job.link, currentUser._id).then(() => {
              // (for this example, the link will always be example.com, but really it would be attatched to the job that the report button is attatched to.)
              // once the request is complete, display the success message.
              setSuccessMessage(true);
            });
          }
        } else {
          // if it has not...
          postReport(job.link, currentUser._id).then(() => {
            // make a POST request to post the new report.
            // once the post request has gone through, display the success message.
            setSuccessMessage(true);
          });
        }
      });
    };

  return (
    <div style={{border: "1px solid #ddd", padding: 5, marginBottom: 5, borderRadius: 4}}>
      {job.title}
      {job.link && (<a href={job.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 15 }}>View Job Posting</a>)}
      <div>
        <button
            onClick={(event) => {
              handleReportSubmission(job.link);
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
  )
}