import React from "react";
import { useState, useEffect, useEffectEvent } from "react";
import SuggestedListEntry from "./SuggestedListEntry.jsx";

import { Grid, Container, Box, Button, Input, FormControl, InputLabel } from "@mui/material";
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
  let [limit, setLimit] = useState(15);
  const [userZipCodeInput, setUserZipCodeInput] = useState("");

  // executes logic on initial render & every time a change is made to userInfo
  useEffect(() => {
    getJobListingsEvent(userPrefs);
  }, [userPrefs]);

  const getJobListingsEvent = useEffectEvent((prefsArr, userZipCode) => {
    getJobListings(prefsArr, userZipCode);
  });


    const handleInputChange = (e) => {
    setUserZipCodeInput(e.target.value);
  };

  const handleApplyChanges = () => {
    getJobListingsEvent(userPrefs, userZipCodeInput)
  }

  // method used to render 5 more
  // jobs listings to the page
  const renderMoreJobs = () => {
    setLimit((limit += 10));
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
    <>
      <Container maxWidth="lg" sx={{ mt: 8}}>
        <Box
          sx={{
            justifyContent: "flex-end",
            display: "flex",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: 'center',
              gap: 2,
              mr: "13px"
            }}
          >
            <FormControl>
              <InputLabel htmlFor="zip-code-input">Enter Zip Code</InputLabel>
            <Input id="zip-code-input"
            onChange={handleInputChange}
            value={userZipCodeInput}
            ></Input>
            </FormControl>
            <Button
              onClick={handleApplyChanges}
              variant="contained"
              color="inherit"

              sx={{ height: "50px" }}
            >
              Apply
              Changes
            </Button>
            
          </Box>
        </Box>
        <Box
          sx={{
            mt: 1,
            height: "100%",
            width: "100%",
          }}
        >
          <Grid
            container
            className="job-list"
            sx={{
              maxHeight: 645,
              minWidth: 0,
              minHeight: 0,
              overflow: "auto",
            }}
          >
            {jobs.length !== 0 ? (
              jobs.map((job) => (
                <SuggestedListEntry
                  name={job.title}
                  link={job.redirect_url}
                  description={job.description}
                  location={`${job.location.area[3]}, ${job.location.area[1]}`}
                  key={job.id}
                  jobs={jobs}
                />
              ))
            ) : (
              <img
                style={{ margin: "auto" }}
                src="https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-22-68_512.gif"
              ></img>
            )}
          </Grid>
        </Box>
      </Container>
      <div
        className="load-more-jobs"
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "10px",
          pt: 2,
        }}
      >
        {jobs.length !== 0 ? (
          <Button
            size="large"
            flex="1"
            onClick={() => {
              renderMoreJobs();
            }}
          >
            Load More Jobs
          </Button>
        ) : null}
      </div>
    </>
  );
}
