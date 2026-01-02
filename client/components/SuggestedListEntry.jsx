import React, { useState } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CardActionArea,
} from "@mui/material";

function SuggestedListEntry({ name, location, onClick }) {
  return (
    <>
      <Grid size={2.4} minWidth={0}>
        <Box
          sx={{
            width: "95%",
            height: "95%",
            aspectRatio: "1 / 1",
            flexDirection: "column",
          }}
        >
          <Card
            sx={{
              height: "100%",
              display: "flex",
              textAlign: "center"
            }}
            elevation={6}
          >
            <CardActionArea onClick={onClick}>
              <CardContent>
                <Typography variant="h6" fontSize={16}>
                  {name}
                </Typography>
              </CardContent>
              <Typography variant="body1">
                {location.replace(/undefined,/g, "").replace(/undefined/g, "")}
              </Typography>
            </CardActionArea>
          </Card>
        </Box>
      </Grid>
    </>
  );
}

export default React.memo(SuggestedListEntry);
