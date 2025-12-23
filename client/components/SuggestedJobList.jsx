import React from "react";
import { useState, useEffect, useEffectEvent } from "react";
import SuggestedListEntry from "./SuggestedListEntry.jsx";

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

export default function SuggestedJobList({ jobs, getJobListings }) {
  const [selectedPrefs, setSelectedPrefs] = useState(new Set());
  let [limit, setLimit] = useState(4);
  const [suggestionResponse, setSuggestionResponse] = useState("");
  const [suggestionInputValue, setSuggestionInputValue] = useState("");

  // executes logic on initial render & every time a change is made to selectedPrefs
  useEffect(() => {
    // if there is no preferences, render default jobs from API
    if (selectedPrefs.size === 0) {
      getDefaultJobListingsEvent();
    }
    // attempted every render, used to render preference specific jobs from API
    getJobListingsEvent();
  }, [selectedPrefs]);

  // handles suggestion success/fail message visibility
  // should disappear after 5 seconds
  useEffect(() => {
    // 5 second timer after a value is
    // given to suggestionResponse state
    const visibilityTimer = setTimeout(() => {
      setSuggestionResponse("");
    }, 5000);

    // cleanup function that cancels timer if
    // component is unmounted before the timer finishes
    // prevents memory leak
    return () => {
      clearTimeout(visibilityTimer);
    };
  }, [suggestionResponse]);

  // an Event for getJobListings to prevent stale closures
  const getDefaultJobListingsEvent = useEffectEvent(() => {
    getJobListings();
    return; // do nothing, end function (page would initally load very slow without return)
  });

  // an Event for getJobListings (with arguments provided)
  const getJobListingsEvent = useEffectEvent(() => {
    // loop won't run until preferences are provided
    for (const pref of selectedPrefs) {
      let prefsArray = Array.from(selectedPrefs);
      getJobListings(pref, prefsArray);
    }
    return; // do nothing, end function (page would initally load very slow without return)
  });

  // when box is checked/unchecked, this function
  // adds/removes the preferences in selectedPrefs state
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setSelectedPrefs((prevSelectedPrefs) => {
      // make copy of current selectedPrefs
      // state to safely mutate set, then
      // returned changes so that setSelectedPrefs
      // may update state with changes to set
      const newPrefs = new Set(prevSelectedPrefs);

      if (checked) {
        // if checked add preference
        newPrefs.add(name);
      } else {
        // if unchecked delete preference
        newPrefs.delete(name);
      }
      return newPrefs;
    });
  };

  // track suggestion input field's value
  // going to be used to get the length
  // to render character count
  const handleInputChange = (e) => {
    setSuggestionInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    // Prevent browser from reloading page
    e.preventDefault();

    // Read form data
    const form = e.target;
    const formData = new FormData(form);
    console.log(formData);

    // passing formData directly into POST request
    axios
      .post("/api/findjobs", {
        name: formData.get("suggestion-input"),
      })
      // if successful suggestionResponse state with String
      .then(() => {
        setSuggestionResponse("Sent! Awaiting Approval.");
      })
      // if fail
      .catch((err) => {
        console.log(err.response.data.name);
        const errorName = err.response.data.name;
        if (errorName === "minlength") {
          setSuggestionResponse(
            "Failed to Send! Minimum Characters Required: 2"
          );
        } else if (errorName === "maxlength") {
          setSuggestionResponse(
            "Failed to Send! Maximum Characters Allowed: 50"
          );
        } else {
          // all other errors
          console.error(err);
          setSuggestionResponse(`Failed to Send! Error Code: ${err.status}`);
        }
      });
  };

  // method used to render 5 more
  // jobs listings to the page
  const renderMoreJobs = () => {
    setLimit((limit += 5));
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
      <h2>Choose your job preferences</h2>
      <div
        className="job-preferences-checkboxes"
        style={{ display: "flex", gap: "10px" }}
      >
        <div>
          <label htmlFor="it-jobs">
            <input
              id="it-jobs"
              type="checkbox"
              name="it-jobs"
              checked={selectedPrefs.has("it-jobs")}
              onChange={handleCheckboxChange}
            ></input>
            Information Technology
          </label>
        </div>
        <div>
          <label htmlFor="customer-services-jobs">
            <input
              id="customer-services-jobs"
              type="checkbox"
              name="customer-services-jobs"
              checked={selectedPrefs.has("customer-services-jobs")}
              onChange={handleCheckboxChange}
            ></input>
            Customer Service
          </label>
        </div>
        <div>
          <label htmlFor="engineering-jobs">
            <input
              id="engineering-jobs"
              type="checkbox"
              name="engineering-jobs"
              checked={selectedPrefs.has("engineering-jobs")}
              onChange={handleCheckboxChange}
            ></input>
            Engineering
          </label>
        </div>
      </div>
      <div>
        <h3>
          Don&apos;t see a preference that matches you?
          <br />
          Suggest More Here:
        </h3>
        <div>
          <form method="post" onSubmit={handleSubmit}>
            <label>
              <input
                name="suggestion-input"
                type="text"
                onChange={handleInputChange}
                required={true}
              ></input>
            </label>
            <button type="submit">Send Preference</button>&nbsp;
            {suggestionResponse}
          </form>
          Character Count: {suggestionInputValue.length}
          <br />
        </div>
      </div>
      <div
        className="job-list"
        style={{
          display: "flex",
          height: "560px",
          width: "100%",
          border: "2px solid black",
          overflow: "auto",
        }}
      >
        <div className="job-list-entry">
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
        </div>
      </div>
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
            if (selectedPrefs.size === 0) {
              getDefaultJobListingsEvent();
            }
            getJobListingsEvent();
            renderMoreJobs();
          }}
        >
          Load More Jobs
        </button>
      </div>
    </div>
  );
}
