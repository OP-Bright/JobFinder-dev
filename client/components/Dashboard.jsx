import React from "react";
import axios from "axios";

import { useState, useEffect } from "react";
import { Box, Button , Dialog, Select } from "@mui/material"

import JobList from "./JobList.jsx"

//need to import statuses or set them here

//create dashboard component
export default function Dashboard () {

  //set state of jobs when fetched from backend & rendered to page
  const [jobs, setJobs] = useState([]);// useState hook b/c jobs need re render when jobs state changes
  //set state for visibility of create jobs dialog
  const [dialog, openDialog] = useState(false);
  //set state for adding a new job title
  const [title, setTitle ] = useState(""); //useState hook b/c input field updates as user types
  //set state for adding a status to job
  const [status, setStatus] = useState("applied") //useState hook b/c dialog dropdown updates state when status changes



  //useEffect hook runs on mount renders all user jobs to dashboard
  useEffect(() => {
    //call to backend endpoint
    axios.get('/api/jobs')
    //get jobs data in response
    .then((job) => {
      //save job data in jobs state
      setJobs(job.data);
      //error handling
    }).catch((err) => {
      console.log(err);
    })

  }, []) //useEffect runs once after mount


  const CreateJob = () => {

  }




  return (
    <Box>
      <Button variant="contained" color="primary" onClick={() => openDialog(true)}> CREATE JOB

      </Button>

    </Box>

  )

}

