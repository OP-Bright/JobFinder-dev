import React, { useCallback } from "react";
import { useEffect, useState } from "react";
import {
  Button,
  MenuItem,
  OutlinedInput,
  FormControl,
  InputLabel,
  Chip,
  Select,
  Box,
  Card,
  CardContent,
  Container,
  Typography,
  Paper,
  Input,
  TextField,
  FormHelperText,
} from "@mui/material";
import axios from "axios";

export default function Profile({ userInfo, userPrefs, getUserInfo }) {
  const [storedPrefs, setStoredPrefs] = useState([]);
  const [selectedPrefs, setSelectedPrefs] = useState([]);
  const [suggestionInputValue, setSuggestionInputValue] = useState("");
  const [suggestionResponse, setSuggestionResponse] = useState("")




  // handles suggestion success/fail message visibility
  // should disappear after 5 seconds
  useEffect(() => {
    // 5 second timer after a value is
    // given to suggestionResponse state
    const visibilityTimer = setTimeout(() => {
      setSuggestionResponse("");
    }, 5000);

    // cleanup function that cancels timer if
    // component is unmounted before the timer finishes
    // prevents memory leak
    return () => {
      clearTimeout(visibilityTimer);
    };
  }, [suggestionResponse]);


  // on intitial render/on change of stored preferences,
  // trigger rerender and update storedPrefs state
  useEffect(() => {
    console.log('render')
    if (userInfo && userPrefs.length !== 0) {
      setSelectedPrefs(userPrefs);
    }
    getPrefs();
  }, [userInfo, userPrefs]);

  const getPrefs = () => {
    axios
      .get("/api/preferences")
      .then((response) => {
        const prefsArr = response.data;
        setStoredPrefs(prefsArr);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedPrefs(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleClick = () => {
  
    axios
      .patch(`/api/update-preferences/${userInfo._id}`, {
        preferences: selectedPrefs,
      })
      .then((response) => {
        const successMsg = response.data;
        getUserInfo()
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // track suggestion input field's value
  // going to be used to get the length
  const handleInputChange = (e) => {
    setSuggestionInputValue(e.target.value);
  };

  const handleSend = (e) => {
    // passing formData directly into POST request
    axios
      .post("/api/suggest-preferences", {
        name: suggestionInputValue,
      })
      // if successful suggestionResponse state with String
      .then(() => {
        setSuggestionResponse("Sent! Awaiting Approval.");
      })
      // if fail
      .catch((err) => {
        console.error(err);
        setSuggestionResponse(
          `Something went wrong. Error Code: ${err.status}`
        );
      });
    }

    // before render check if user is signed in,
    if (!userInfo) {
      return <div>You should not be here buddy</div>;
    }

    return (
      <Container
        sx={{
          height: "92vh",
        }}
      >
        <Box
          sx={{
            pt: 4,
            width: "100%",
            textAlign: "center",
          }}
        >
          <Paper elevation={4}>
            <Card sx={{ width: "100%", height: "100%" }}>
              <CardContent>
                <Typography variant="h2">
                  Signed In As: {userInfo.displayName}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Box>
        <Box
          sx={{
            pt: 4,
            height: "80%",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Paper elevation={6}>
            <Card sx={{ width: "100%", height: "100%" }}>
              <CardContent>
                <Typography variant="h2" sx={{ mt: 4 }}>
                  Choose your Preferences!
                </Typography>
              </CardContent>
              <FormControl sx={{ m: 1, width: 300, mt: 4 }}>
                <InputLabel>Preferences</InputLabel>
                <Select
                  labelId="preferences-multiple-chip-label"
                  id="preferences-multiple-chip"
                  multiple
                  value={selectedPrefs}
                  onChange={handleChange}
                  input={<OutlinedInput label="Preferences" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((prefValue, i) => (
                        <Chip
                          key={i}
                          label={prefValue
                            .replace(/-/g, " ")
                            .replace(/jobs/g, "")
                            .toUpperCase()}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {storedPrefs.map((pref, i) => (
                    <MenuItem key={i} value={pref}>
                      {pref
                        .replace(/-/g, " ")
                        .replace(/jobs/g, "")
                        .toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
                <Button
                  variant="contained"
                  color="inherit"
                  size="large"
                  sx={{ mt: 1 }}
                  onClick={handleClick}
                >
                  Apply Changes
                </Button>
              </FormControl>
              <CardContent>
                <Typography variant="h6" sx={{ mt: 10 }}>
                  Can&apos;t find a preference that fits?
                  <br />
                  Suggest one here:
                </Typography>
              </CardContent>
              <FormControl>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <TextField
                    maxLength="50"
                    minLength=""
                    value={suggestionInputValue}
                    onChange={handleInputChange}
                  ></TextField>
                  <Button
                    onClick={handleSend}
                    variant="contained"
                    color="inherit"
                    size="large"
                    sx={{ height: "50px" }}
                  >
                    Send
                  </Button>
                </Box>
                <FormHelperText>
                  Suggestion review may take up to 7 business days.
                </FormHelperText>
              </FormControl>
              <CardContent>
                <Typography variant="h6">
                  {suggestionResponse}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Box>
      </Container>
    );
  };
