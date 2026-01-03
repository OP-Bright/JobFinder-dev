
import React from "react"

import JobListEntry from "./JobListEntry.jsx";

// accepts jobs and status props
export default function StatusSection({status, jobs, currentUser}){
  return(
    <div style={{ flex: 1, margin: "0 10px", border: "1px solid #ccc", padding: 10 }}>
      <h3>{status[0].toUpperCase() + status.slice(1)}</h3>
      {/*map over jobs */}
      {jobs.map((job) => {
         {/*render one entry, pass one entry(job) down as prop, set unique key  */}
        return <JobListEntry key={job._id} job={job} currentUser={currentUser} />
      })}
    </div>
  )
}
