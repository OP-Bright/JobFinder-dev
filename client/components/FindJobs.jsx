import React, { useState, useEffect } from "react";

import SuggestedJobList from "./SuggestedJobList.jsx";

export default function FindJobs({ jobs, getJobListings, userPrefs}) {

  return (
    <SuggestedJobList
      jobs={jobs}
      getJobListings={getJobListings}
      userPrefs={userPrefs}
    />
  );
}
