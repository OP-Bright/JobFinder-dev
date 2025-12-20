import React from "react";
import { useEffect, useEffectEvent } from 'react'
import ExampleJobEntry from "./ExampleJobEntry.jsx";

export default function ExampleJobs({ exampleJobs, getJobListings }) {

    
    // when component renders grab default job listings
    useEffect(() => {
        getDefaultJobListingsEvent();
    }, []);
    
    // an Event for getJobListings to prevent stale closures
    const getDefaultJobListingsEvent = useEffectEvent(() => {
        getJobListings();
        return; // do nothing, end function (page would initally load very slow without return)
    });
    
    
    const exampleJobsToRender = exampleJobs.slice(0, 6)
    

  return (
    <div
      className="example-job-list"
      style={{
        display: "flex",
        height: "560px",
        width: "100%",
        border: "2px solid black",
        overflow: "auto",
      }}
    >
      <div className="example-job-list-entry">
        {exampleJobsToRender.map((job) => {
          return (
            <ExampleJobEntry
              name={job.title}
              link={job.redirect_url}
              description={job.description}
              key={job.id}
            />
          );
        })}
      </div>
    </div>
  );
}
