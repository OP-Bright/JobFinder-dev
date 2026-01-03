import React from "react";
import { useEffect, useEffectEvent } from 'react'
import { Box, Container, Grid } from "@mui/material";
import ExampleJobEntry from "./ExampleJobEntry.jsx";

export default function ExampleJobs({ exampleJobs, getJobListings }) {

    
    useEffect(() => {
     getJobListings() 
    }, [])
    
    const exampleJobsToRender = exampleJobs.slice(0, 15)
    

  return (
    <Container maxWidth="lg" sx={{mt: 2}}>
        <Box sx={{ mt: 1, height: "100%", width: "100%" }}>
          <Grid
            container
            className="example-job-list"
            sx={{ maxHeight: 645, minWidth: 0, minHeight: 0 }}
          >
            {exampleJobsToRender.length !== 0 ? (
              exampleJobsToRender.map((job) => (
                <ExampleJobEntry
                  name={job.title}
                  link={job.redirect_url}
                  description={job.description}
                  location={`${job.location.area[3]}, ${job.location.area[1]}`}
                  key={job.id}
                />
              ))
            ) : (
              <img
                style={{ margin: "auto" }}
                src="https://cdn.pixabay.com/animation/2022/07/29/03/42/03-42-22-68_512.gif"
              />
            )}
          </Grid>
        </Box>
        </Container>
  );
}
