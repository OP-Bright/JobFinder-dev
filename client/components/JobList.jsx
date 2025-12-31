import React from "react";

import StatusSection from "./StatusSection.jsx";

//define columns names
const jobStatus = ["applied", "interviewing", "offer", "rejected"];

//job list accepts jobs prop from dashboard
export default function JobList({jobs}){
  return(
    //side by side flex box style
    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
      {/* for each status create a column */}
      {jobStatus.map((status) => {
        {/* */}
       return <StatusSection
       key={status}
       //column label is status name
       status={status}
       //what the column shows
       //filter jobs and get ones w/ status matching column name
       jobs={jobs.filter((job) => job.status === status)} />
      })}
    </div>
  )

}
