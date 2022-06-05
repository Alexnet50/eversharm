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
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { LogIn } from "./LogIn"
import { SignIn } from "./SignIn"

export default function Header() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
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
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };
    
    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const signUserOut = () => {
        signOut(auth).then(() => {       
            setUser((prev) => ({ ...prev, isAdmin: false }));   
        });
    };

    
    const handlePasswordChange = async () => {
        try {
            await sendPasswordResetEmail(auth, user.currentUser.email);
            setUser((prev) => ({ ...prev, 
                modalContent: 
                <>
                    <Typography sx={{ m: 2 }} variant='h5' >Password reset link sent!</Typography>
                    <Button onClick={closeModal} sx={{ ml: '80%'}} >OK</Button>
                </>
                ,
                openModal: true 
            }))             
            } catch (error) {
                setUser((prev) => ({ ...prev, 
                    modalContent: 
                    <>
                        <Typography sx={{ m: 2 }} variant='h5' >{error.message}</Typography>
                        <Button onClick={closeModal} sx={{ ml: '80%'}} >OK</Button>
                    </>
                    ,
                    openModal: true 
                }))     
                console.error(error);
                alert(error.message);
            }
    };
      
    const toggleLoginDrawer = () => {        
        setLoginDrawerState(!loginDrawerState);
    };

    const toggleSigninDrawer = () => {        
        setSigninDrawerState(!signinDrawerState);
    }; 

    const closeModal = () => {setUser((prev) => ({ ...prev, openModal: false}))};

    const linkStyle = {        
        textDecoration: "none",        
    };


    return (   
        <>   
            <AppBar position="static" color={user.isAdmin ? "secondary" : "primary"} sx={{ mb: 1 }}>               
                <Container maxWidth="lg">
                    <Toolbar>
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="/"
                            fontFamily="Frijole"
                            sx={{
                                mr: 2,
                                // display: { xs: 'none', md: 'flex' },                        
                                // fontWeight: 700,                          
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
                            
                                {!user.currentUser &&
                                    <MenuItem>                                  
                                        <Button
                                            sx={{ display: 'block' }}
                                            onClick={toggleLoginDrawer}
                                        >   
                                            Log In
                                        </Button>                                        
                                    </MenuItem>
                                }

                                {!user.currentUser && 
                                    <MenuItem>                                
                                        <Button
                                            sx={{ display: 'block' }}
                                            onClick={toggleSigninDrawer}
                                        >
                                            Sign In
                                        </Button>                                                                       
                                    </MenuItem>
                                }
                                

                                {user.currentUser && !user.isAdmin && 
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

                                {user.currentUser &&
                                    <MenuItem>                                                                       
                                        <Button 
                                            onClick={handleOpenUserMenu}
                                            sx={{ display: 'block' }}
                                        >
                                            User
                                        </Button>                                
                                    </MenuItem>  
                                }
                            </Menu>
                            
                            {user.currentUser &&
                                <Menu
                                    id="menu-user"
                                    anchorEl={anchorElUser}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'left',
                                    }}
                                        open={Boolean(anchorElUser)}
                                        onClick={handleCloseUserMenu}
                                        sx={{
                                            display: { xs: 'block' },
                                    }}
                                >
                                    <MenuItem>
                                        <Typography>User: {user.currentUser.email}</Typography>
                                    </MenuItem>                            
                                    
                                    <MenuItem>                                  
                                        <Button
                                            sx={{ display: 'block' }}
                                            onClick={handlePasswordChange}
                                        >   
                                            Change password
                                        </Button>                                        
                                    </MenuItem>                                

                                    <MenuItem>                                
                                            <Button onClick={signUserOut}>Log out</Button>                                                               
                                    </MenuItem>
                                </Menu>
                            }
                        </Box>                      

                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>

                            {/* APP BAR MENU */}

                            <Link to={"/"} style={linkStyle}>
                                <Button
                                    sx={{ color: 'white', display: 'block' }}
                                >
                                    Home
                                </Button>
                            </Link>

                            {!user.currentUser &&                                
                                <Button
                                    sx={{ color: 'white', display: 'block' }}
                                    onClick={toggleLoginDrawer}
                                >   
                                    Log In
                                </Button>                               
                            }

                            {!user.currentUser &&                              
                                <Button
                                    sx={{ color: 'white', display: 'block' }}
                                    onClick={toggleSigninDrawer}
                                >
                                    Sign In
                                </Button>                                                            
                            }

                            {user.currentUser && !user.isAdmin &&                            
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

                            
                            {user.currentUser &&                                                                                                       
                                <Button 
                                    sx={{ color: 'white', display: 'block' }}
                                    onClick={handleOpenUserMenu}
                                >
                                    User
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
                                display: { xs: 'none', sm: 'flex'
                                //  md: 'flex' 
                                },                                                  
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

                        
                        {user.currentUser && 
                            <Box edge="end" sx={{ textAlign: 'center', display: { xs: 'none', lg: 'block' } }}>
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
                                    You are logged as 
                                    <br/>
                                    {user.currentUser.email}
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