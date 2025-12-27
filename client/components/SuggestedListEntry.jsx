import React, { useState } from "react";
import {
  Button,
  Modal,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CardActions,
  CardActionArea,
  Divider,
} from "@mui/material";

export default function SuggestedListEntry({
  name,
  link,
  description,
  jobId,
  location,
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Grid size={2.4} key={jobId} minWidth={0}>
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
              textAlign: "center",
            }}
            elevation={6}
          >
            <CardActionArea onClick={handleOpen}>
              <CardContent>
                <Typography variant="h6" fontSize={18}>{name}</Typography>
              </CardContent>
              <Typography variant="body1">
                {location.replace(/undefined,/g, "").replace(/undefined/g, "")}
              </Typography>
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
            flexDirection: "row"
          }}
        >
          <Card sx={{ width: "100%", height: "100%" }}>
            <Box

            >
              <CardContent>
                <Typography variant="h5" textAlign="center">
                  {name}
                </Typography>
              </CardContent>
              <Divider />
              <CardContent>
                <Typography variant="body1" textAlign="center" fontSize={24}>
                  {description.split("Job Purpose").shift().split("Why join this team?").shift()}
                </Typography>
              </CardContent>
              <Divider />
            </Box>
            <CardActions p={0}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  width: "100%",
                }}
              >
                <Button href={link} target="_blank" rel="noopener noreferrer" variant="contained" color="primary" size="large">
                  Apply To Job
                </Button>
              </Box>
            </CardActions>
          </Card>
        </Box>
      </Modal>
    </>
  );
}
