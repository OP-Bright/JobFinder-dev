import React from "react";
import { useState, useRef, useEffect } from "react";
import { Routes, Route } from "react-router";
import axios from "axios";

import Home from "./Home.jsx";
import SignIn from "./SignIn.jsx";
import Profile from "./Profile.jsx";
import FindJobs from "./FindJobs.jsx";
import DashBoard from "./Dashboard.jsx";
import NavBar from "./Navbar.jsx";

export default function App() {
  const [jobResults, setJobResults] = useState([]);
  const countRef = useRef(0);
  // if user is logged in
  const [userInfo, setUserInfo] = useState(null);
  const [userPrefs, setUserPrefs] = useState([]);

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = () => {
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
  };

  const getJobListings = async (prefsArray) => {
    
    if (prefsArray.length === 0) {
      let defaultJobsObj = await axios.get("/api/findjobs").catch(err => console.error("Failed to GET default job listings", err))
      const defaultJobs = defaultJobsObj.data
      setJobResults(defaultJobs)
    } else {
      let combinedJobs = [];

      for (const pref of prefsArray) {
        let prefJobsObj =  await axios.get(`/api/findjobs/${pref}`).catch(err => console.error("Failed to GET preference job listings", err));
        const prefJobs = prefJobsObj.data
      combinedJobs.push(prefJobs)
      }
  setJobResults(filterUniqueJobs(combinedJobs.flat(prefsArray.length)))
  
    }

    // required to "update" the function when it's being used in child component.
    // without useRef + countRef an infinite loop is triggered since adding a function
    // in useEffect dependency array causes it to create a new instance of the function
    // being used, and won't update the logic inside the new instance, meaning it'll use
    // whatever the previous or 1st function's logic values were.
    countRef.current += 1;

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
    };
  };
console.log(jobResults)
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/dashboard" element={<DashBoard />}></Route>
        <Route
          path="/profile"
          element={<Profile userInfo={userInfo} />}
        ></Route>

        <Route
          path="/findjobs"
          element={
            userInfo ? (
              <FindJobs
                jobs={jobResults}
                getJobListings={getJobListings}
                userInfo={userInfo}
                userPrefs={userPrefs}
              />
            ) : null
          }
        ></Route>
      </Routes>
    </>
  );
}
