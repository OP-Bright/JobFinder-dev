import React from "react";
import { useState, useEffect, useEffectEvent } from "react";
import SuggestedListEntry from "./SuggestedListEntry.jsx";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import axios from "axios";

/* 
  EXPLANATION OF useEffectEvent:
  Was used to prevent stale closure issue
  that was happening when using getJobListings
  method directly. Stale closures cause functions
  to retain outdated references to variables from
  its surrounding scope. This relevant here because
  getJobListings is a method in App.jsx and relies
  on its jobResults state to be updated.
*/

export default function SuggestedJobList({ jobs, getJobListings, userPrefs }) {
  let [limit, setLimit] = useState(8);
  // executes logic on initial render & every time a change is made to userInfo


  useEffect(() => {
    if (userPrefs.length !== 0) {
      for (const pref of userPrefs) {
        getJobListingsEvent(pref, userPrefs);
        return;
      }
    }
    getJobListingsEvent()
  }, [userPrefs]);

  const getJobListingsEvent = useEffectEvent((pref, prefsArr) => {
    getJobListings(pref, prefsArr);
  });

  // method used to render 5 more
  // jobs listings to the page
  const renderMoreJobs = () => {
    setLimit((limit += 8));
  };

  /* Copy of current jobs listings state from App.jsx.
   App.jsx's job listings contain more 
   jobs than we want shown initially.

   jobsToRender used in render logic instead of jobs array 
   so they we have control of how many listings are shown.
   */
  const jobsToRender = jobs.slice(0, limit);

  // styling for now is placeholder, MUI will be used later to bring everything together
  return (
    <div>
      <h1>Find Jobs</h1>
      <Container maxWidth="xl">
        <Grid container spacing={2} overflow="auto" className="job-list">
          {jobsToRender.map((job) => {
            return (
              <SuggestedListEntry
                name={job.title}
                link={job.redirect_url}
                description={job.description}
                key={job.id}
                jobs={jobs}
              />
            );
          })}
        </Grid>
      </Container>
      <div
        className="load-more-jobs"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        {/* same logic as our useEffect in this component
            only difference is the ability to increment limit's state,
            and ensure we have latest results API 
            sometimes too many requests error when using checkboxes) WIP
          */}
        <button
          onClick={() => {
            renderMoreJobs();
          }}
        >
          Load More Jobs
        </button>
      </div>
    </div>
  );
}
