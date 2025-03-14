import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
// import AdbIcon from '@mui/icons-material/Adb';
// import { Icon } from "@material-ui/core";
import { useNavigate } from 'react-router-dom';
import { Icon } from '@mui/material';
import { getRolesContains } from '../auth/authHelpers';

const routes = {
  "About Us" : "/about-us",
  "Blog" : "/blog",
  "Create Blog": "/create-blog"
}
const pages = [
  {
    name: 'Blog', 
    meta: {
      url: "/blog"
    }
  }, 
  {
    name: 'About Us', 
    meta: {
      url: "/about-us"
    }
  }
];
const loggedInSettings = [
  {
    name: 'Profile', 
    meta: {
      url: "/profile"
    }
  }, 
  {
    name: 'Account', 
    meta: {
      url: "/account"
    }
  }, 
  {
    name: 'Logout', 
    meta: {
      url: "holder"
    }
  }
]

function ResponsiveNavBar({auth}) {

  
  const signOutRedirect = () => {
    localStorage.removeItem('user')
    const clientId = "7ut8bpppnbdsu3f25uokq3gd39";
    const logoutUri = `${process.env.REACT_APP_BASE_URL}/logged-out`;
    const cognitoDomain = "https://fairway-fish-fusion-domain.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const navigate = useNavigate();

  const loggedOutSettings = [
    {
      name: 'Log In', 
      meta: {
        url: `test`
      }
    }
  ]
  //Will do some check here in the future, cookies etc.
  let isLoggedIn = auth.isAuthenticated
  let username = "";
  let groups = [];

  if (isLoggedIn) {
    localStorage.setItem('user', JSON.stringify(auth.user));
    username = auth.user.profile["cognito:username"].toUpperCase()
    groups = auth.user.profile["cognito:groups"]
  }
  const settings = isLoggedIn ? loggedInSettings : loggedOutSettings;

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);

  };

  const getRoute = (text) => {
    return routes[text] 
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const navigateToPage = (event) => {
    navigate(getRoute(event.target.textContent))
  }

  return (
    <AppBar position="static" sx={{bgcolor: "rgba(150, 150, 150, 0.7)"}}>
      <Container maxWidth="xl">
        <Toolbar disableGutters> 
          <Icon onClick={() => { navigate("/")} } sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
              <img src={process.env.PUBLIC_URL + "/icon.ico"} alt="Logo" height={25} width={25}/>
          </Icon>
          <Typography
            variant="h6"
            noWrap
            component="a"
            // href=""
            onClick={() => { navigate("/")} }
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            F<sup>3</sup>
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <Typography onClick={navigateToPage} sx={{ textAlign: 'center' }}>{page.name}</Typography>
                </MenuItem>
              ))}
              
              { getRolesContains(["blogger", "admin"], groups) &&  
                <MenuItem key={"Create Blog"} onClick={handleCloseNavMenu}
              >
                <Typography onClick={navigateToPage} sx={{ textAlign: 'center' }}>Create Blog</Typography>
              </MenuItem>
              }
            </Menu>
          </Box>
          <Icon onClick={() => { navigate("/")} } sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}>
              <img src={process.env.PUBLIC_URL + "/icon.ico"} alt="Logo" height={25} width={25}/>
          </Icon>
          <Typography
            variant="h5"
            noWrap
            component="a"
            onClick={() => { navigate("/")} }
            // href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'black',
              textDecoration: 'none',
            }}
          >
            F<sup>3</sup>
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={navigateToPage}
                sx={{ my: 2, color: 'black', fontWeight: 'bold', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
            { getRolesContains(["blogger", "admin"], groups) &&  
              <Button
              onClick={navigateToPage}
              sx={{ my: 2, color: 'black', fontWeight: 'bold', display: 'block' }}
            >
              Create Blog
            </Button>
            }
          </Box>
          <Box sx={{ flexGrow: 0}}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {isLoggedIn && <Avatar alt={username} src="/static/images/avatar/2.jpg" />}
                {!isLoggedIn && <Avatar alt="" src="/static/images/avatar/2.jpg" />}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px'}}
              id="basic-menu"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                setting.name === "Logout" ?
                <MenuItem key={setting.name} href={setting.meta.url} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }} href={setting.meta.url}>
                  <Button onClick={() =>  { auth.removeUser(); signOutRedirect()}}>
                  {setting.name}
                  </Button>
                  </Typography>
                </MenuItem> :
                <MenuItem key={setting.name} href={setting.meta.url} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: 'center' }} href={setting.meta.url}>
                  {!isLoggedIn && <Button onClick={auth.signinRedirect}> 
                      {setting.name}
                    </Button>}
                  {isLoggedIn && <Button> 
                    {setting.name}
                  </Button>}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveNavBar;