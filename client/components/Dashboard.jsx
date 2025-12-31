import React from "react";
import axios from "axios";

import { useState, useEffect } from "react";
import { Box, Button , Dialog, DialogContent, TextField, FormControl, InputLabel, MenuItem, DialogActions, Select } from "@mui/material"

import JobList from "./JobList.jsx"


//need to import statuses or set them here
const jobStatus = ["applied", "interviewing", "offer", "rejected"]

//create dashboard component
export default function Dashboard () {

  //set state of jobs when fetched from backend & rendered to page
  const [jobs, setJobs] = useState([]);// useState hook b/c jobs need re render when jobs state changes
  //set state for visibility of create jobs dialog false = hidden
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

  //handle creating a new job when user sets title and status and clicks save
  const CreateJob = () => {
    //post to backend to create a job
    axios.post('/api/jobs', {title, status})
    .then((job) => {//when job created
      console.log(job)
      setJobs(job.data)
      //close dialog
      openDialog(false);
      //set input to the initial state
      setTitle("");
      //set dropdown to default
      setStatus("applied");

    }).catch((err) => {
      console.log(err);
    });

  }




  return (
    /*create job button */
    <Box>
      <Button variant="contained" color="primary" onClick={() => openDialog(true)}> CREATE JOB</Button>
    {/* create job dialog, clicking outside closes*/}
      <Dialog open={dialog} onClose={() => openDialog(false)}>
        <DialogContent>
          {/* text input displays default title, updates on every letter */ }
          <TextField label="Enter Job Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth sx={{mb: 2}} />
            <FormControl fullWidth>
              <InputLabel> STATUS </InputLabel>
              {/*shows default status updates status when changed to whatever is typed*/}
              <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                 {/*loop through statuses*/}
                {jobStatus.map((stat) => (
                <MenuItem key={stat} value={stat}>{/*set menu items to statuses (each status can be selected)*/}
                  {stat} {/*display status*/}
                </MenuItem>
              ))}
              </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>

          <Button onClick={() => openDialog(false)}>CANCEL</Button>
          <Button onClick={CreateJob} variant="contained" color="primary"> Save </Button>
        </DialogActions>
        </Dialog>
        <JobList jobs={jobs} />

    </Box>

  )

}

