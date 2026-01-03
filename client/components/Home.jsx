import React, { useEffect } from "react";
import { Link } from "react-router";
import { Stack, Box, Typography, Button } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import ExampleJobs from "./ExampleJobs.jsx";
import findJobs from "../src/assets/find-jobs.png";
import dashboard from "../src/assets/dashboard.png";

export default function Home({ jobs, getJobListings }) {
  return (
    <Stack sx={{ width: "100vw", height: "100vh" }}>
      <Stack
        direction={"row"}
        bgcolor="#bbdefb"
      >
        <Box display="flex" m={10}>
          <Box>
            <img
              height="100%"
              width="auto"
              src="https://media.istockphoto.com/id/1370901237/photo/shot-of-a-mature-male-architect-standing-with-his-arms-crossed-at-a-building-site.jpg?s=612x612&w=0&k=20&c=pyeQswmuaQhEyXlXHHWlKsCPbq_mWd_zoNZov7i3bgY="
            ></img>
          </Box>

          <Box height="100%" alignItems={"center"} textAlign={"center"} p={0}>
            <Typography variant="h2" mt={6}>
              Job Finder
            </Typography>
            <Typography fontSize={18} sx={{ whiteSpace: "pre-wrap", px: 20 }}>
              <br />
              {`Welcome to JobFinder! Having trouble keeping yourself organized while on the job hunt? Find documenting your progress on your own to be unintuitive? JobFinder is here to help. We aim to streamline the process of finding jobs you're interested in, and help you track your progress.`}
            </Typography>
            <Typography fontSize={24}>
              <br />
              {`Create an account today to make use of our job hunt tools.`}
            </Typography>
            <br />
            <br />
            <Button
              component={Link}
              to="/signin"
              variant="contained"
              color="inherit"
            >
              Get Started
            </Button>
          </Box>
        </Box>
      </Stack>

      <Box>
        <Stack
          direction={"row"}
          spacing={2}
          sx={{
            border: "1px solid black",
            alignItems: "center",
            height: "600px",
            justifyContent: "stretch",
            textAlign: "center",
            p: 10,
          }}
        >
          <Box sx={{ height: "100%", width: "100%", bgcolor: "lightgray" }}>
            <img src={dashboard} height="100%" width="100%"></img>
            <Typography whiteSpace={"pre-wrap"}>
              {`Use our dashboard to organize jobs by your current step in progress!\nYou can manually add jobs that you're interested in applying to.`}
            </Typography>
          </Box>
          <Box sx={{ height: "100%", width: "100%", bgcolor: "lightgray" }}>
            <img src={findJobs} height="100%" width="100%"></img>
            <Typography>
              Find jobs relating to your interests!
              <br />
              Sourced from the Adzuna API.
            </Typography>
          </Box>
          <Box sx={{ height: "100%", width: "100%", bgcolor: "lightgray" }}>
            <WarningIcon
              sx={{ height: "100%", width: "100%", color: "orange" }}
            ></WarningIcon>
            <Typography>
              Our users are able to report fake job postings!
              <br />
              Help our community avoid having their time wasted and information
              taken.
            </Typography>
          </Box>
        </Stack>
      </Box>
      <Typography
        variant="h4"
        textAlign="center"
        sx={{mt: 4}}
      >{`Here's an example of some of the jobs we could help you find!`}</Typography>
      <ExampleJobs exampleJobs={jobs} getJobListings={getJobListings} />
    </Stack>
  );
}
