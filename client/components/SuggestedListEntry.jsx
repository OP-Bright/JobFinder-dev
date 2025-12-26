import React, { useState } from "react";
import {
  Modal,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CardActions,
  CardActionArea,
} from "@mui/material";

export default function SuggestedListEntry({ name, link, description, jobId }) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Grid size={3} key={jobId}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            aspectRatio: "1 / 1",
            flexDirection: "column",
          }}
        >
          <Card sx={{ width: "100%", height: "100%" }}>
            <CardActionArea onClick={handleOpen}>
              <CardContent>
                <Typography variant="h6">{name}</Typography>
              </CardContent>
              <CardContent>
                <Typography variant="body1">{description}</Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Grid>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="full-job-listing-view"
        aria-describedby="full-job-listing-view"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            height: "70%"
          }}
        >
          <Card sx={{ width: "100%", height: "100%" }}>
              <CardContent>
                <Typography variant="h6">{name}</Typography>
              </CardContent>
              <CardContent>
                <Typography variant="body1" fontSize={24} px={6}>{description}</Typography>
              </CardContent>
          </Card>
        </Box>
      </Modal>
    </>
  );
}
