import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../App';
import { AppBar,
    Toolbar,
    Typography,
    Box,
    IconButton,
    Menu,
    Container,
    Button,
    MenuItem,
    TextField,
    InputAdornment,
    Drawer, List, ListItem, ListItemButton, ListItemText
} from '@mui/material';
import { MenuRounded, Search } from '@mui/icons-material/';
import { auth } from "../firebase-config";
import { signOut } from "firebase/auth";
import { LogIn } from "./LogIn"
import { SignIn } from "./SignIn"

export default function Header() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [loginDrawerState, setLoginDrawerState] = useState(false);
    const [signinDrawerState, setSigninDrawerState] = useState(false);
    const {user, setUser} = useContext(UserContext);    
    // const isAdmin = false;
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const signUserOut = () => {
        signOut(auth).then(() => {
        //   localStorage.clear();
            setUser((prev) => ({ ...prev, userName: null, isAdmin: false }));            
        //   window.location.pathname = "/";
        });
    };
      
    const toggleLoginDrawer = () => {        
        setLoginDrawerState(!loginDrawerState);
    };

    const toggleSigninDrawer = () => {        
        setSigninDrawerState(!signinDrawerState);
    }; 

    const linkStyle = {        
        textDecoration: "none",        
    };


    return (   
        <>   
            <AppBar position="static" color={user.isAdmin ? "secondary" : "primary"}>               
                <Container maxWidth="lg">
                    <Toolbar>
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/"
                            sx={{
                                mr: 2,
                                // display: { xs: 'none', md: 'flex' },                        
                                fontWeight: 700,                          
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            EverSharm
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>

                            {/* HAMBOURGER MENU */}

                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuRounded />
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
                                    onClick={handleCloseNavMenu}
                                    sx={{
                                        display: { xs: 'block', md: 'none' },
                                }}
                            >
                                <MenuItem>
                                    <Link to={"/"} style={linkStyle}>
                                    <Button
                                        sx={{ display: 'block' }}
                                    >
                                        Home
                                    </Button>
                                    </Link>
                                </MenuItem>
                            
                                {!user.userName &&
                                    <MenuItem>                                  
                                        <Button
                                            sx={{ display: 'block' }}
                                            onClick={toggleLoginDrawer}
                                        >   
                                            Log In
                                        </Button>                                        
                                    </MenuItem>
                                }

                                {!user.userName && 
                                    <MenuItem>                                
                                        <Button
                                            sx={{ display: 'block' }}
                                            onClick={toggleSigninDrawer}
                                        >
                                            Sign In
                                        </Button>                                                                       
                                    </MenuItem>
                                }
                                

                                {user.userName && !user.isAdmin && 
                                    <MenuItem>                                   
                                        <Link to={"/createreview"} style={linkStyle}>
                                            <Button
                                                sx={{ display: 'block' }}
                                            >
                                                Create A Review
                                            </Button>
                                        </Link>                        
                                    </MenuItem>
                                }

                                
                                {user.isAdmin &&
                                    <MenuItem>                             
                                        <Link to={"/createhotel"} style={linkStyle}>
                                            <Button
                                                sx={{ display: 'block' }}
                                            >
                                                Create A Hotel
                                            </Button>
                                        </Link>                          
                                    </MenuItem>    
                                }

                                {user.userName &&
                                    <MenuItem>                                
                                        <Button onClick={signUserOut}>Log out</Button>                                
                                    </MenuItem>  
                                }
                            </Menu>
                        </Box>
                        
                        {/* <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/"
                            sx={{                        
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,                       
                            fontWeight: 700,                        
                            color: 'inherit',
                            textDecoration: 'none',
                            }}
                        >
                            EverSharm
                        </Typography> */}

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

                            {/* APP BAR MENU */}

                            <Link to={"/"} style={linkStyle}>
                                <Button
                                    sx={{ color: 'white', display: 'block' }}
                                >
                                    Home
                                </Button>
                            </Link>

                            {!user.userName &&                                
                                <Button
                                    sx={{ color: 'white', display: 'block' }}
                                    onClick={toggleLoginDrawer}
                                >   
                                    Log In
                                </Button>                               
                            }

                            {!user.userName &&                              
                                <Button
                                    sx={{ color: 'white', display: 'block' }}
                                    onClick={toggleSigninDrawer}
                                >
                                    Sign In
                                </Button>                                                            
                            }

                            {user.userName && !user.isAdmin &&                            
                                <Link to={"/createreview"} style={linkStyle}>
                                    <Button
                                        sx={{ color: 'white', display: 'block' }}
                                    >
                                        Create A Review
                                    </Button>
                                </Link>
                            }
                            
                            {user.isAdmin &&
                                <Link to={"/createhotel"} style={linkStyle}>
                                    <Button
                                        sx={{ color: 'white', display: 'block' }}
                                    >
                                        Create A Hotel
                                    </Button>
                                </Link>        
                            }

                            {user.userName &&
                                <Button 
                                    onClick={signUserOut}
                                    sx={{ color: 'white', display: 'block' }}
                                >
                                    Log out
                                </Button>                    
                            }                         
                        </Box>                 

                        <TextField 
                            id="outlined-search"
                            label="Search field"
                            type="search"
                            size="small"
                            color="primary"
                            sx={{                        
                                display: { xs: 'none', md: 'flex' },                                                  
                                fontWeight: 700,                        
                                color: 'primary'                            
                                }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                            <Search sx={{ color: 'secondary'  }}/>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        
                        {user.userName && 
                            <Box edge="end" sx={{ display: { xs: 'none', md: 'block' } }}>
                                <Typography
                                    variant="subtitle2"
                                    noWrap                                
                                    sx={{ 
                                        ml: 4,  
                                        mr: 0,                                                   
                                        color: 'secondary',
                                        textDecoration: 'none',
                                    }}
                                >
                                    Logged as 
                                    <br/>
                                    {user.userName}
                                    {/* {auth.currentUser.email} */}
                                </Typography>
                            </Box>
                        }             
                    </Toolbar>
                </Container>            
            </AppBar>

            <Drawer
                anchor="left"
                open={loginDrawerState}
                onClose={toggleLoginDrawer}
            >
                <Box
                    sx={{ width: 'auto' }}                  
                >
                    <LogIn callback={setLoginDrawerState}/>                   
                </Box>
            </Drawer> 

            <Drawer
                anchor="left"
                open={signinDrawerState}
                onClose={toggleSigninDrawer}
            >
                <Box
                    sx={{ width: 'auto' }}                   
                >
                    <SignIn callback={setSigninDrawerState}/>                   
                </Box>
            </Drawer>         
        </>
    )
}