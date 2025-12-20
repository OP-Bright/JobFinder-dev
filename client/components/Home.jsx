import React from "react";
import { Link } from "react-router";
import ExampleJobs from "./ExampleJobs.jsx";
export default function Home({ jobs, getJobListings }) {

  return (
    <div>
      <h1>Home Page (WIP)</h1>
      <Link to="/findjobs">Find Jobs</Link>
    <ExampleJobs exampleJobs={jobs} getJobListings={getJobListings} />
    </div>
  );
}
