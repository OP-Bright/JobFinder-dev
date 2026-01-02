import React from "react";
import { Link } from "react-router";
import ExampleJobs from "./ExampleJobs.jsx";
export default function Home({ jobs, getJobListings }) {

  return (
    <div id="home-page">
      <div id="user-intro">
        <p>replace me with an image</p>
        <h1>JobFinder</h1> {/* We should replace this with some kind of image logo? */}
        <p>{"Welcome to JobFinder! Having trouble keeping yourself organized while on the job hunt? Find documenting your progress on your own to be unintuitive? JobFinder is here to help. We aim to streamline the process of finding jobs you're interested in, and help you track your progress. Create an account today to make use of our job hunt tools!"}</p>
        <div>
          <Link to="/signin">Sign In w/ Google</Link>
        </div>
      </div>
      <div id="user tutorial">
        <div id="dashboard-example">
          <p>replace me with an image showing the dashboard</p>
          <p>{"Use our dashboard to organize jobs by your current step in progress! You can manually add jobs that you're interested in applying to."}</p>
        </div>
        <div id="findjobs-example">
          <p>replace me with an image showing the findJobs page</p>
          <p>Find jobs relating to your interests! Sourced from the Adzuna API.</p>
        </div>
          <div id="reporting-example">
          <p>replace me with an image showing the reporting warning</p>
          <p>{"Users can report fake job postings! Help our community avoid having their time wasted and information taken."}</p>
        </div>
      </div>
      <div id="example-jobs-wrapper">
        <p>{"Here's an example of some of the jobs we could help you find!"}</p>
        <p>replace me with ExampleJobs</p>
        {/* <ExampleJobs /> */}
      </div>
    </div>
  );
}
