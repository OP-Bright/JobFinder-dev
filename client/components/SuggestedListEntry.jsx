import React from "react";
import { Grid, Card, CardContent, Typography, Box } from "@mui/material";
export default function SuggestedListEntry({ name, link, description, jobId }) {
  return (
    <Grid size={3} key={jobId}>
      <Box
        sx={{
          width: "100%", 
          height: '100%',
          aspectRatio: "1 / 1", 
          flexDirection: "column",
        }}
      >
        <Card sx={{width: '100%', height: '100%'}}>
          <CardContent>
            <Typography variant="h6">{name}</Typography>
            <a href={link} target="_blank" rel="noopner noreferrer">
              Click here to apply directly
            </a>
            {/* Descriptions end in... will need let client know to go to job posting for full description*/}
            <CardContent variant="body2">{description}</CardContent>
          </CardContent>
        </Card>
      </Box>
    </Grid>
  );
}
