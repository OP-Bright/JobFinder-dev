import React, { useState, useEffect } from "react";
import { Navigate } from "react-router";
import SuggestedJobList from "./SuggestedJobList.jsx";

export default function FindJobs({ jobs, getJobListings, userPrefs, userInfo}) {

  return (
    <SuggestedJobList
      jobs={jobs}
      getJobListings={getJobListings}
      userPrefs={userPrefs}
    />
  );
}
