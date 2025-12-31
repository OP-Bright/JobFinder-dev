import React from "react"

//accepts job prop from statusSection
export default function JobListEntry ({job}){
  return (
    <div style={{border: "1px solid #ddd", padding: 5, marginBottom: 5, borderRadius: 4}}>
      {job.title[0].toUpperCase() + job.title.slice(1)}
    </div>
  )
}