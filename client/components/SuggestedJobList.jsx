import React from "react";
import { useState, useEffect, useEffectEvent } from "react";
import SuggestedListEntry from "./SuggestedListEntry.jsx";

export default function SuggestedJobList({ jobs, getJobListings }) {
  const [selectedPrefs, setSelectedPrefs] = useState(new Set());
  let [limit, setLimit] = useState(5);
  const getDefaultJobListingsEvent = useEffectEvent(() => {
    getJobListings();
    return; // do nothing, end function (page would initally load very slow without return)
  });

  const getJobListingsEvent = useEffectEvent(() => {
    // loop won't run until preferences are provided
    for (const pref of selectedPrefs) {
      let prefsArray = Array.from(selectedPrefs);
      getJobListings(pref, prefsArray);
    }
    return; // do nothing, end function (page would initally load very slow without return)
  });

  // function that runs on initial render
  // also runs every time selectedPrefs is updated
  useEffect(() => {
    if (selectedPrefs.size === 0) {
      getDefaultJobListingsEvent();
    }
    // if selectedPrefs isn't empty
    getJobListingsEvent();
  }, [selectedPrefs]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;

    setSelectedPrefs((prevSelectedPrefs) => {
      const newPrefs = new Set(prevSelectedPrefs);

      if (checked) {
        newPrefs.add(name);
      } else {
        // if not checked
        newPrefs.delete(name);
      }
      return newPrefs;
    });
  };

  const renderMoreJobs = () => {
    setLimit((limit += 5));
  };

  const jobsToRender = jobs.slice(0, limit);

  return (
    <div>
      <h1>Find Jobs</h1>
      <h2>Choose your job preferences</h2>
      <div
        className="job-category-checkboxes"
        style={{ display: "flex", gap: "10px" }}
      >
        <div>
          <label>
            <input
              type="checkbox"
              name="it-jobs"
              checked={selectedPrefs.has("it-jobs")}
              onChange={handleCheckboxChange}
            ></input>
            Information Technology
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="customer-services-jobs"
              checked={selectedPrefs.has("customer-services-jobs")}
              onChange={handleCheckboxChange}
            ></input>
            Customer Service
          </label>
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              name="engineering-jobs"
              checked={selectedPrefs.has("engineering-jobs")}
              onChange={handleCheckboxChange}
            ></input>
            Engineering
          </label>
        </div>
      </div>
      <div
        className="job-list"
        style={{
          display: "flex",
          height: "700px",
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
          marginTop: '20px'
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
