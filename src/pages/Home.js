import React, { useContext, useEffect, useState } from 'react';
import {collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../firebase-config";
import { UserContext } from '../App';
import { Box, Button, Typography, Paper, Grid, Card, Checkbox,
    CardMedia, CardActionArea,
   FormControl, InputLabel, Select, MenuItem, FormControlLabel
   } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { blue } from '@mui/material/colors';
import HotelsList from './HotelsList';

export default function Home() {
    const { user, setUser } = useContext(UserContext);
    const [posts, setPosts] = useState("");
    const [sort, setSort] = useState({
        value: 'rating', 
        order: 'desc', 
        name: 'rating', 
        three: 3, 
        four: 4, 
        five: 5
    });
    
    function createMarkup(post) { return {__html: post}; };

    const postsCollectionRef = collection(db, "posts");

    const getPosts = async() => {                
        const data = await getDocs(postsCollectionRef);
        const postsArray = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
        setPosts(postsArray); 
        console.log(postsArray)            
    };

    const sortHandler = (event) => {        
        event.target.value === 'name' ?
        setSort((prev) => ({...prev, value: 'name', order: 'asc', name: 'hotelName'})) :
        setSort((prev) => ({...prev, value: 'rating', order: 'desc', name: 'rating'}));
        
    };

    const toggleCheckbox = (digit) => {
        switch (digit) {
            case 5: 
            sort.five === 5 ? setSort((prev) => ({...prev, five: 0})) : setSort((prev) => ({...prev, five: 5}));
            break;
            case 4: 
            sort.four === 4 ? setSort((prev) => ({...prev, four: 0})) : setSort((prev) => ({...prev, four: 4}));
            break;
            case 3: 
            sort.three === 3 ? setSort((prev) => ({...prev, three: 0})) : setSort((prev) => ({...prev, three: 3}));
        }        
    }

    const deleteHandler = async (postId) => {        
        const postDoc = doc(db, "posts", postId);
        await deleteDoc(postDoc);
        getPosts();       
    };  

    useEffect(() => {         
        setUser((prev) => ({...prev, currentHotel: null})); 
        getPosts();       
    }, []);
    
    return (
        <Grid container spacing={1}>            
            <Grid item className={'mainBlock'} xs={12} md={9} 
                // sx={{ display: 'flex', flexDirection: 'column'}}
            >
                <Grid container className={'mainBlock'} spacing={1}>
                    <Grid item className={'slider'} sm={12} sx={{ position: 'relative' }}                     
                    >
                        <Paper sx={{ position: 'absolute', bottom: '-25px', left: '50%', transform: 'translate(-55%, 0)',
                            p: 1, display: "flex", flexDirection: "row", alignItems: "center"
                        }}
                            style={{ zIndex: 2, backgroundColor: 'rgba(235, 247, 255, 1)', borderRadius: '20px' }}
                            elevation={3}
                        >
                            <FormControl sx={{ m: 1, mr: 2 }} size="small">
                                <InputLabel>Sort by</InputLabel>
                                <Select                    
                                    id="sort"
                                    sx={{ width: 200 }}                    
                                    value={sort.value}
                                    label="Sorting order"
                                    onChange={sortHandler}
                                >                    
                                    <MenuItem value={"name"} >name</MenuItem>
                                    <MenuItem value={"rating"} >rating</MenuItem>                        
                                </Select>
                            </FormControl>
                            

                            <Box sx={{ display: "flex", flexDirection: "row", m: 1 }}>
                                    <FormControlLabel control={
                                        <Checkbox 
                                            checked={sort.five === 5}
                                            size='small'
                                            onChange={(event) => toggleCheckbox(5)}
                                        />} 
                                        label="5 stars" 
                                        sx={{ width: '100px'}}
                                    />
                                    <FormControlLabel control={
                                        <Checkbox
                                            checked={sort.four === 4}
                                            size='small'
                                            onChange={(event) => toggleCheckbox(4)}
                                        />} 
                                        label="4 stars"
                                        sx={{ width: '100px'}} 
                                    />
                                    <FormControlLabel control={
                                        <Checkbox 
                                            checked={sort.three === 3}
                                            size='small'
                                            onChange={(event) => toggleCheckbox(3)}
                                        />} 
                                        label="3 stars"
                                        sx={{ width: '100px'}}
                                    />
                            </Box>
                        </Paper>
                        
                        <Box sx={{ maxWidth: '95%' }}>
                            <Slider 
                                // ref={slider}
                                fade={true}
                                arrows={false}                         
                                rows={1}                                
                                autoplay={true}                                                                  
                            >

                                <div                                               
                                    style={{ position: 'relative'}}                                    
                                >   
                                    <Typography variant="h3" sx={{  mt: 2, mr: 5 }} 
                                        style={{ position: 'absolute', left: '30px'}}
                                        color="rgba(255, 255, 255, 1)" fontFamily={'Merriweather'} fontWeight={300}
                                    >
                                        Open up a breathtaking world of Sharm El Sheikh
                                    </Typography>
                                    
                                    <img src={'/images/slide1.jpg'} key={1} alt={"Sharm El Sheikh"} height={'450px'} />
                                </div>

                                <div  
                                    // sx={{ mr: coef }}                  
                                    style={{ position: 'relative'}}
                                     
                                >
                                    <Typography variant="h3" sx={{ ml: 'auto', mr: 'auto' }}
                                        style={{ position: 'absolute', bottom: '50px', left: '30px' }} 
                                        color="rgba(255, 255, 255, 1)" fontFamily={'Merriweather'} fontWeight={300}
                                    >
                                        Find your own paradise under palmtrees
                                    </Typography>
                                    
                                    <img src={'/images/slide2.jpg'} key={2} alt={"Sharm El Sheikh"} height={'450px'} />                                   
                                </div>

                                <div  
                                    // sx={{ mr: coef }}                  
                                    style={{ position: 'relative' }}
                                    
                                >
                                    <Typography variant="h3" sx={{ mt: 3 }}
                                        style={{ position: 'absolute', left: '250px' }} 
                                        color="rgba(255, 255, 255, 1)" fontFamily={'Merriweather'} fontWeight={300}
                                    >
                                        Discower treasures of misterious Egypt
                                    </Typography>
                                    
                                    <img src={'/images/slide3.jpg'} key={3} alt={"Sharm El Sheikh"} height={'450px'} />                                    
                                </div>

                                <div                                                 
                                    style={{ position: 'relative' }}                                     
                                >
                                    <Typography variant="h3" sx={{ mt: 3, mr: 3 }}
                                        style={{ position: 'absolute', left: '30px' }} 
                                        color="rgba(255, 255, 255, 1)" fontFamily={'Merriweather'} fontWeight={300} 
                                    >
                                        Dive into warm waters of the Red sea
                                    </Typography>
                                    
                                    <img src={'/images/slide4.jpg'} key={4} alt={"Sharm El Sheikh"} height={'450px'} />                                    
                                </div>                          
                            </Slider> 
                        </Box>
                    </Grid>

                    <Grid item className={'hotelsList'} xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column'}}>
                        <HotelsList sort={sort} /> 
                    </Grid>

                    <Grid item className={'posts'} xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column'}}>
                        {posts && 
                            <Paper sx={{ p: 2, mb: 2 }} elevation={2}>
                                {posts.map(post => {
                                    <div key={post?.id} dangerouslySetInnerHTML={createMarkup(post?.post)} 
                                        marginBottom="20px"
                                    />
                                    {user.isAdmin && 
                                        <Button 
                                            onClick={() => deleteHandler()}
                                        >
                                            Delete post
                                        </Button>
                                    }                                                                    
                                })}                            
                            </Paper>
                        }
                    </Grid>
                </Grid> 
            </Grid>
            <Grid item className={'sideBlock'} xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column'}}>
                
                
            </Grid>  
                       
        </Grid>    
    )
}