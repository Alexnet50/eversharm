import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
} from '@mui/material';
import { MenuRounded, Search } from '@mui/icons-material/';
import {auth, db, storage} from "../firebase-config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";


    const pages = ['Products', 'Pricing', 'Blog'];
    const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

export default function Header({ isAuth, setIsAuth }) {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const signUserOut = () => {
        signOut(auth).then(() => {
        //   localStorage.clear();
            setIsAuth(false);
        //   window.location.pathname = "/";
        });
    };

    useEffect(() => {        
        auth.currentUser != null && auth.currentUser.email === "aladdin@ukr.net" ?
        setIsAdmin(true) :
        setIsAdmin(false);
        console.log(isAdmin);
    }, []); 

    const linkStyle = {        
        textDecoration: "none",        
    };


    return (        
        <AppBar position="static">
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
                                onClose={handleCloseNavMenu}
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
                            
                            <MenuItem>
                                {!isAuth && 
                                <>
                                    <Link to={"/signin"} style={linkStyle}>
                                        <Button
                                            sx={{ display: 'block' }}
                                        >
                                            Sign In
                                        </Button>
                                    </Link>
                                </>
                                }
                            </MenuItem>
                        
                            <MenuItem>
                                {!isAuth && 
                                <>
                                    <Link to={"/login"} style={linkStyle}>
                                        <Button
                                            sx={{ display: 'block' }}
                                        >   
                                            Log In
                                        </Button>
                                    </Link>
                                </>
                                }
                            </MenuItem>

                            <MenuItem>
                                {isAuth && 
                                    <>
                                        <Link to={"/createreview"} style={linkStyle}>
                                            <Button
                                                sx={{ display: 'block' }}
                                            >
                                                Create A Review
                                            </Button>
                                        </Link>                                                                                
                                    </>
                                }
                            </MenuItem>

                            <MenuItem>
                                <Button onClick={signUserOut}>Log out</Button>
                            </MenuItem>
                        
                            <MenuItem>                                     
                                {isAdmin &&
                                    <Link to={"/createhotel"} style={linkStyle}>
                                        <Button
                                            sx={{ display: 'block' }}
                                        >
                                            Create A Hotel
                                        </Button>
                                    </Link>        
                                }  
                            </MenuItem>                        
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

                        {!isAuth && 
                            <>
                                <Link to={"/signin"} style={linkStyle}>
                                    <Button
                                        sx={{ color: 'white', display: 'block' }}
                                    >
                                        Sign In
                                    </Button>
                                </Link>

                                <Link to={"/login"} style={linkStyle}>
                                    <Button
                                        sx={{ color: 'white', display: 'block' }}
                                    >   
                                        Log In
                                    </Button>
                                </Link>
                            </>
                        }
                        {isAuth && 
                            <>
                                <Link to={"/createreview"} style={linkStyle}>
                                    <Button
                                        sx={{ color: 'white', display: 'block' }}
                                    >
                                        Create A Review
                                    </Button>
                                </Link>

                                <Button 
                                    onClick={signUserOut}
                                    sx={{ color: 'white', display: 'block' }}
                                >
                                    Log out
                                </Button>
                                {/* <input type="file" onChange={(event) => setImageUpload(event.target.files[0])} />
                                <button onClick={uploadImage}>Upload image</button> */}
                            </>
                        }

                        {isAdmin &&
                            <Link to={"/createhotel"} style={linkStyle}>
                                <Button
                                    sx={{ color: 'white', display: 'block' }}
                                >
                                    Create A Hotel
                                </Button>
                            </Link>        
                        }
                        {/* {pages.map((page) => (
                        <Button
                            key={page}
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: 'white', display: 'block' }}
                        >
                            {page}
                        </Button>
                        ))} */}
                    </Box>
                    
                    

                    <TextField 
                        id="outlined-search"
                        label="Search field"
                        type="search"
                        size="small"
                        color="primary"
                        sx={{                        
                            display: { xs: 'none', md: 'flex' },
                            flexGrow: 1,                       
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

                    
                    {isAuth && 
                        <Box edge="end" sx={{ display: { xs: 'none', md: 'block' } }}>
                            <Typography
                                variant="subtitle2"
                                noWrap                                
                                sx={{ 
                                    ml: 4,  
                                    mr: 0,                                                  
                                    fontWeight: 400,                        
                                    color: 'secondary',
                                    textDecoration: 'none',
                                }}
                            >
                                Logged as 
                                <br/>
                                {auth.currentUser.email}
                            </Typography>
                        </Box>
                    }             
                </Toolbar>
            </Container>            
        </AppBar>
        
    )
}