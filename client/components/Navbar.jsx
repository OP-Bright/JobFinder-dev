import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import { Link } from "react-router";


function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
     <AppBar position="static">
      <Container maxWidth="large">
        <Toolbar disableGutters>
          <IconButton
            size="large"
            aria-label="open menu"
            onClick={handleOpenNavMenu}
            color="inherit"
            sx={{mr: 1}}
          >
          <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, fontWeight: 700 }}
          >
            Job Find
          </Typography>

          <Menu
            anchorEl={anchorElNav}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <MenuItem
              component={Link}
              to="/"
              onClick={handleCloseNavMenu}
            >
              Home
            </MenuItem>

            <MenuItem
              component={Link}
              to="/dashboard"
              onClick={handleCloseNavMenu}
            >
              Dashboard
            </MenuItem>

            <MenuItem
              component={Link}
              to="/findjobs"
              onClick={handleCloseNavMenu}
            >
              Find Jobs
            </MenuItem>

             <MenuItem
              component={Link}
              to="profile"
              onClick={handleCloseNavMenu}
            >
              Profile
            </MenuItem>

             {/* <MenuItem
              component={Link}
              to="/logout"
              onClick={handleCloseNavMenu}
            >
              Logout
            </MenuItem> */}


          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;