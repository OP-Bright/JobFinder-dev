import React from "react";
import { Card, CardContent, Typography, Box, Grid } from "@mui/material";
export default function ExampleJobEntry({ name, location }) {
  return (
    <>
      <Grid size={2.4} minWidth={0}>
        <Box
          sx={{
            width: "95%",
            height: "95%",
            aspectRatio: "1 / 1",
          
          }}
          >
          <Card
            sx={{
    
              height: "95%",
              textAlign: "center"
            }}
            elevation={6}
          >
            
              <CardContent>
                <Typography variant="h6" fontSize={20}>
                  {name}
                </Typography>
              </CardContent>
              <Typography variant="body1">
                {location.replace(/undefined,/g, "").replace(/undefined/g, "")}
              </Typography>
          </Card>
        </Box>
      </Grid>
    </>
  );
}
