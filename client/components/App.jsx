import React from "react";
import { useState, useRef } from "react";
import { Routes, Route } from "react-router";
import axios from "axios";

import Home from "./Home.jsx";
import SignIn from "./SignIn.jsx";
import FindJobs from "./FindJobs.jsx";
import DashBoard  from "./Dashboard.jsx";
import NavBar from "./Navbar.jsx";

export default function App() {
  const [jobResults, setJobResults] = useState([]);
  const countRef = useRef(0);

  const getJobListings = (category, prefsArray) => {
    axios
      // if category is undefined || is used to check that, then it sets category to be "nothing"
      // without || category being undefined literally returns '/findjobs/undefined' instead of '/findjobs/'
      .get(`/api/findjobs/${category || ""}`)
      .then((jobsObj) => {
        // if category not provided or we're doing initial render, return default job list
        if (!category) {
          const noPrefJobs = jobsObj.data;
          setJobResults(noPrefJobs);
        } else if (category && prefsArray.length === 1) {
          // one category provided, replace all existing job listings
          const firstPrefJobs = jobsObj.data;
          setJobResults(firstPrefJobs);
        } else {
          // otherwise category was provided, but there's more than one preference
          const additionalPrefJobs = jobsObj.data;
          // helper only needed here to ensure possible job category overlap does
          // not return duplicate results when merging additional category's job listings
          setJobResults(
            filterUniqueJobs(additionalPrefJobs.concat(jobResults))
          );
        }
      })
      .catch((err) => {
        console.error("Failed to GET jobs from endpoint", err);
      });

    // required to "update" the function when it's being used in child component.
    // without useRef + countRef an infinite loop is triggered since adding a function
    // in useEffect dependency array causes it to create a new instance of the function
    // being used, and won't update the logic inside the new instance, meaning it'll use
    // whatever the previous or 1st function's logic values were.
    countRef.current += 1;

    // helper to ensure jobs state contains only unique job listings based on id
    const filterUniqueJobs = (arr) => {
      const seenIds = new Set();
      return arr.filter((item) => {
        if (seenIds.has(item.id)) {
          // If it's a duplicate job filter it out
          return false;
        } else {
          // Otherwise add id to set, and job object to filter array
          seenIds.add(item.id);
          return true;
        }
      });
    };
  };

  return (
  <>
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/signin" element={<SignIn />}></Route>
      <Route path="/dashboard" element={<DashBoard />}></Route>

      <Route
        path="/findjobs"
        element={<FindJobs jobs={jobResults} getJobListings={getJobListings} />}
      ></Route>
    </Routes>
  </>
  );
}
