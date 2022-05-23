import React, {useEffect, useState, useContext, useMemo, Provider} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Container,
        Box,
        Card,
        CardContent,
        CardActions,
        Button,
        CardMedia,
        Typography,
        Grid
        } from '@mui/material';
import {auth, db, storage} from "./firebase-config";
import { ref, uploadBytes, listAll, getDownloadURL, list } from "firebase/storage";
import { v4 } from "uuid";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignIn from "./pages/SignIn";
import CreateReview from "./pages/CreateReview";
import Header from "./pages/Header";
import CreateHotel from "./pages/CreateHotel";




import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

let key = 0;

function App() {
    const [isAuth, setIsAuth] = useState(false); 
    
    const [imageList, setImageList] = useState([]);

    const imageListRef = ref(storage, "images/")

    

    

    

    useEffect(() => {
        
        listAll(ref(storage, "images/")).then((response) => {
            setImageList([]);
            // let imageList = [];
            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    // imageList.push(url);
                    setImageList((prev) => [...prev, url]); 
                })
            });
            // setImageList(imageList);
        })
    }, [])
    // console.log(currentUser);

    return (
        <>
        
            <Container>
                <Router>
                    <Header isAuth={isAuth} setIsAuth={setIsAuth} />
                        {/* <nav>
                            <Link to={"/"}><button>Home</button></Link>
                            <Link to={"/hotel"}><button>Hotel</button></Link>
                            {!isAuth && <Link to={"/signin"}><button>Sign In</button></Link>}
                            {!isAuth && <Link to={"/login"}><button>Log In</button></Link>}
                            {isAuth && 
                                <>
                                    <Link to={"/createreview"}><button>Create A Review</button></Link>
                                    <button onClick={signUserOut}>Log out</button> */}
                        
                                {/* </>
                            }           
                        </nav> */}
                    <Routes>
                        <Route path="/" element={<Home isAuth={isAuth} /> } />
                        <Route path="/createhotel" element={<CreateHotel setImageList={setImageList} /> } />
                        <Route path="/login" element={<LogIn setIsAuth={setIsAuth}/> } />
                        <Route path="/signin" element={<SignIn setIsAuth={setIsAuth}/> } />
                        <Route path="/createreview" element={<CreateReview isAuth={isAuth}/> } />
                    </Routes>
                    {/* {isAuth && <h3>User logged in: {auth.currentUser.email}</h3>} */}
                    {/* {console.log(imageList)} */}


                    <Grid container spacing={2} sx={{ mt: 1}}>
                        {imageList.map((url) => {
                            key++;                            
                            return (
                                <Grid item>
                                    <Card sx={{ maxWidth: 345 }}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={url}
                                            alt="travel"
                                    />
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                Hotel
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            {isAuth &&                                                
                                                <Link to={"/createreview"}><Button size="small" sx={{ mr: 1}}>Add A Review</Button></Link>
                                            }
                                            {/* <Button size="small">Add a reviev</Button> */}
                                            <Button size="small">More info</Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            // <img src={url} key={key} />                               
                            )
                        })}
                    </Grid>
                </Router>

                
                
        
            </Container>

            
        
        {/* // <UserContext.Provider value={value}> */}
                      
           
        </>
        
    );
}

export default App;
