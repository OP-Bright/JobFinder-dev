import React from "react";
import axios from "axios";

import { useState, useEffect } from "react";
import { Box, Button , Dialog, DialogContent, TextField, FormControl, InputLabel, MenuItem, DialogActions, Select, Alert } from "@mui/material"

import JobList from "./JobList.jsx"


//need to import statuses or set them here
const jobStatus = ["applied", "interviewing", "offer", "rejected"]

//create dashboard component
export default function Dashboard ({ currentUser }) {

  //state of jobs
  const [jobs, setJobs] = useState([]);//jobs need re render when jobs state changes
  // visibility of create jobs dialog false = hidden
  const [openDialog, setDialog] = useState(false);
  //state of title, adding a new job title
  const [title, setTitle ] = useState("");
  //state of status, adding a status to job
  const [status, setStatus] = useState("applied"); //default to 'applied'
  //state of job link
  const [link, setLink] = useState("");

  // REPORTING STUFF
  const [reportCount, setReportCount] = useState(0); // just used to tell the user how many people have reported the link.
  const [reportWarning, setReportWarning] = useState(false); // tells the app whether or not it needs to display a warning to the user. 

  const getReportedLink = (url) => {
    return axios
      .get("/api/reported-links", url ? { params: { link: url } } : {})
      .catch((err) => {
        console.error(
          `Something went wrong while GETting a report. Url passed in: ${url}`,
          err
        );
      });
  };

  // checks if the link provided has been reported before.
  // if it has,
  // grab the data, and see how many times its been reported, i.e, the length of userIDs.
  // if it's 3 or greater...
  //display a warning, along with the number of users who have reported the link
  // they can still input it but it lets them know.
  // if it has not, it doesn't need to do a thing!
  const handleClickOffInput = (inputValue) => {
    getReportedLink(inputValue).then((reportObj) => {
      if(reportObj) {
        if (reportObj.data.usersReported.length >= 3) {
          setReportCount(reportObj.data.usersReported.length);
          setReportWarning(true);
        }
      }
    });
  };

  //useEffect hook runs on mount renders all user jobs to dashboard
  useEffect(() => {
    //call to backend endpoint
    axios.get('/api/jobs', /*{ withCredentials: true }*/)
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
    //post to backend to create a job w/ job data in req body
    axios.post('/api/jobs', {title, status, link} /*,{ withCredentials: true }*/)
    .then((job) => {//when job created
      //add newly created job to existing jobs, update its state
      setJobs(prevJob => [...prevJob, job.data]);
      //close dialog
      setDialog(false);
      //set input to the initial state
      setTitle("");
      //set dropdown to default
      setStatus("applied");
      //set link to init state
      setLink("")

    }).catch((err) => {
      console.log(err);
    });

  }

  //handle updating a job
   //const UpdateJob = (jobId, newStatus) => {
  //   //put to backend to update a job w/ by id
  //   axios.put(`/api/jobs/${jobId}`, {
  //     //set current state of status to the new status
  //     status: newStatus
  //   }).then((updated) => {
  //      //get updated jobs data in response
  //     const updatedJob = updated.data;

  //     setJobs(prevJobs => prevJobs.map(job => {
  //         job._id === updatedJob._id ? updatedJob : job
  //       }
  //     ))
  //   }).catch((err) => {
  //     console.log(err);
  //   });
   //}




  return (
    /*create job button */
    <Box>
      <Button variant="contained" color="primary" onClick={() => setDialog(true)}> CREATE JOB</Button>
    {/* create job dialog controlled by open state, onClose sets state to original state, clicking outside closes*/}
      <Dialog open={openDialog} onClose={() => setDialog(false)}>
        <DialogContent>
          {/* text input displays default title, onChange sets title to keystroke */ }
          <TextField required label="Enter Job Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth sx={{mb: 2}} />
              <TextField label="Enter Job Link" value={link} onChange={(e) => setLink(e.target.value)} fullWidth sx={{mb: 2}} onBlur={(event) => {handleClickOffInput(event.target.value)}}/>
              {reportWarning ? (
                <Alert severity="warning">
                  Are you sure you want to add this job? {reportCount} users have reported this job listing as fraudulent.
                </Alert>
              ) : (
                <></>
              )}
            <FormControl fullWidth>
              <InputLabel>STATUS</InputLabel>
              {/*shows default status, onChange sets status to status */}
              <Select labelId="statusLabel" id="status-label" value={status} label='STATUS' onChange={(e) => setStatus(e.target.value)}>
                 {/*loop through status array*/}
                {jobStatus.map((stat) => (
                <MenuItem key={stat} value={stat}>{/*value = value selected when item chosen (statuses can be selected)*/}
                  {stat.toUpperCase()} {/*display status*/}
                </MenuItem>
              ))}
              </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
              {/*cancel job button reset to init state*/}
          <Button onClick={() => setDialog(false)}>CANCEL</Button>
          {/*save job button*/}
          <Button onClick={CreateJob} variant="contained" color="primary"> Save </Button>
        </DialogActions>
        </Dialog>
        <JobList jobs={jobs} /*onUpdate={UpdateJob}*/ currentUser={currentUser} />

    </Box>

  )

}

