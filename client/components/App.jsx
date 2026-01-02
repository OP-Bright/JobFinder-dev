import React from "react";
import { useState, useCallback, useEffect } from "react";
import { Routes, Route } from "react-router";
import axios from "axios";

import Home from "./Home.jsx";
import SignIn from "./SignIn.jsx";
import Profile from "./Profile.jsx";
import FindJobs from "./FindJobs.jsx";
import DashBoard from "./Dashboard.jsx";
import NavBar from "./Navbar.jsx";
// helper to ensure jobs state contains only unique job listings based on id
function filterUniqueJobs(arr) {
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
}

export default function App() {
  const [jobResults, setJobResults] = useState([]);
  // if user is logged in
  const [userInfo, setUserInfo] = useState(null);
  const [userPrefs, setUserPrefs] = useState([]);

  useEffect(() => {
    getUserInfo();
  }, []);


  const getUserInfo = useCallback(() => {
    axios
      .get("/api/user-info")
      .then((response) => {
        const userObj = response.data;
        const { preferences } = response.data;
        setUserInfo(userObj);
        setUserPrefs(preferences);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  jobResults;
  const getJobListings = useCallback(async (prefsArray, zipCode) => {
    if (prefsArray.length === 0) {
      let defaultJobsObj = await axios
        .get("/api/findjobs", { params: { where: zipCode || null } })
        .catch((err) =>
          console.error("Failed to GET default job listings", err)
        );
      const defaultJobs = defaultJobsObj.data;
      setJobResults(defaultJobs);
    } else if (!zipCode) {
      let combinedJobs = [];

      for (const pref of prefsArray) {
        let prefJobsObj = await axios
          .get(`/api/findjobs/${pref}`, { params: { where: zipCode || null } })
          .catch((err) =>
            console.error("Failed to GET preference job listings", err)
          );
        const prefJobs = prefJobsObj.data;
        combinedJobs.push(filterUniqueJobs(prefJobs));
      }
      setJobResults(combinedJobs.flat(prefsArray.length));
    } else {
      // if zip code is provided, replace all job results with location specific results
      let combinedJobs = [];

      for (const pref of prefsArray) {
        let zipPrefJobsObj = await axios
          .get(`/api/findjobs/${pref}`, { params: { where: zipCode || null } })
          .catch((err) =>
            console.error("Failed to GET preference job listings", err)
          );
        const zipPrefJobs = zipPrefJobsObj.data;
        combinedJobs.push(filterUniqueJobs(zipPrefJobs));
      }
      setJobResults(combinedJobs.flat(prefsArray.length));
    }
  }, []);

  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/dashboard" element={<DashBoard />}></Route>
        <Route
          path="/profile"
          element={
            userInfo && <Profile userPrefs={userPrefs} getUserInfo={getUserInfo} userInfo={userInfo} />
          }
        ></Route>

        <Route
          path="/findjobs"
          element={
            userInfo && (
              <FindJobs
                jobs={jobResults}
                getJobListings={getJobListings}
                userInfo={userInfo}
                userPrefs={userPrefs}
              />
            )
          }
        ></Route>
      </Routes>
    </>
  );
}
