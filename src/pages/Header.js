import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {db} from "../firebase-config";
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
    TextField, ClickAwayListener,   
    Drawer, Autocomplete
} from '@mui/material';
import { MenuRounded } from '@mui/icons-material/';
import { auth } from "../firebase-config";
import { signOut, sendPasswordResetEmail } from "firebase/auth";
import { LogIn } from "./LogIn"
import { SignIn } from "./SignIn"

export default function Header() {
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null); 
    const [loginDrawerState, setLoginDrawerState] = useState(false);
    const [signinDrawerState, setSigninDrawerState] = useState(false);
    const [hotels, setHotels] = useState([]);   
    // const [searchValue, setSearchValue] = useState('');
    const {user, setUser} = useContext(UserContext);    
   
    const navigate = useNavigate();
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(anchorElNav ? null : event.currentTarget);
    };
    
    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };    

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
        setAnchorElNav(null);
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

    const hotelsCollectionRef = collection(db, "hotels");

    const getHotels = async() => {                
        const data = await getDocs(hotelsCollectionRef);
        const hotelsArray = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
        setHotels(hotelsArray);             
    };

    useEffect(() => {       
        getHotels()        
    }, []);
        
    useEffect(() => {  
        setHotels([])     
        getHotels()        
    }, [user.currentHotel]);    

    const handleSearch = (newInputValue) => {
        if (newInputValue.length > 0) {
            console.log(newInputValue)
            let chosenHotel = hotels.find(hotel => hotel.hotelName === newInputValue);
            setUser((prev) => ({ ...prev, currentHotel: chosenHotel.id}))            
            navigate(`/hotel`);          
        }        
    }
      
    const toggleLoginDrawer = () => {        
        setLoginDrawerState(!loginDrawerState);
        setAnchorElNav(null);
    };

    const toggleSigninDrawer = () => {        
        setSigninDrawerState(!signinDrawerState);
        setAnchorElNav(null);
    }; 

    const closeModal = () => {setUser((prev) => ({ ...prev, openModal: false}))};

    const linkStyle = {        
        textDecoration: "none",        
    };


    return (   
        <>   
            <AppBar position="static" 
                color="secondary"
                style={{ backgroundColor: !user.isAdmin && 'rgba(0, 174, 255, 1)' }}          
                sx={{ mb: 1, mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'center' }}
            >               
                    <Container maxWidth="lg">
                        <Toolbar>
                            <Typography
                                variant="h5"
                                noWrap
                                component="a"
                                href="/"
                                fontFamily="Merriweather"
                                sx={{
                                    mr: 2,                                                             
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
                                    // autoFocusItem='true'
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
                                        
                                        sx={{
                                            display: { xs: 'block', md: 'none' },
                                    }}
                                >
                                    
                                    <MenuItem>                                    
                                        <Autocomplete                                            
                                            freeSolo
                                            id="searchInput"                                
                                            sx={{ minWidth: 250 }}                                
                                            options={hotels && hotels.map((hotel) => hotel.hotelName)}
                                            // onClick={(event) => setAnchorElNav(event.currentTarget)}
                                            onClose={(event) => setAnchorElNav(null)}
                                            onChange={(event, newInputValue) => {                                    
                                                handleSearch(newInputValue);
                                                // setSearchValue(newInputValue);
                                            }}
                                            renderInput={(params) => (
                                            <TextField
                                                className="searchInput"
                                                {...params}
                                                label="Search"
                                                size="small"                                    
                                                InputProps={{
                                                ...params.InputProps,
                                                type: 'search',
                                                }}
                                            />
                                            )}
                                        />                                                  
                                    </MenuItem>
                                    
                                    <MenuItem>
                                        <Link to={"/"} style={linkStyle}>
                                        <Button
                                            sx={{ display: 'block' }}
                                            onClick={handleCloseNavMenu}
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
                                                    onClick={handleCloseNavMenu}
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
                                                    onClick={handleCloseNavMenu}
                                                >
                                                    Create A Hotel
                                                </Button>
                                            </Link>                          
                                        </MenuItem> 
                                    }

                                    {user.isAdmin &&
                                        <MenuItem>                             
                                            <Link to={"/createpost"} style={linkStyle}>
                                                <Button
                                                    sx={{ display: 'block' }}
                                                    onClick={handleCloseNavMenu}
                                                >
                                                    Create A Post
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
                                    <>
                                        <Link to={"/createhotel"} style={linkStyle}>
                                            <Button
                                                sx={{ color: 'white', display: 'block' }}
                                            >
                                                Create A Hotel
                                            </Button>
                                        </Link> 
                                        
                                                                    
                                        <Link to={"/createpost"} style={linkStyle}>
                                            <Button
                                                sx={{ color: 'white', display: 'block' }}
                                            >
                                                Create A Post
                                            </Button>
                                        </Link>                          
                                    </>       
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

                            <Autocomplete
                                // key={user.currentHotel}
                                // style={{ display={ display: { xs: 'flex', md: 'none' } } }}
                                freeSolo
                                id="searchInput"                                
                                sx={{ minWidth: 250, display: { xs: 'none', sm: 'block' } }}                                
                                options={hotels && hotels.map((hotel) => hotel.hotelName)}
                                onChange={(event, newInputValue) => {                                    
                                    handleSearch(newInputValue);
                                    // setSearchValue(newInputValue);
                                  }}
                                renderInput={(params) => (
                                <TextField
                                    className="searchInput"
                                    {...params}
                                    label="Search"
                                    size="small"                                    
                                    InputProps={{
                                    ...params.InputProps,
                                    type: 'search',
                                    }}
                                />
                                )}
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