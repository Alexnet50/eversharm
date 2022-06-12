import React, { useContext, useEffect, useState } from 'react';
import {collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../firebase-config";
import { UserContext } from '../App';
import { Box, Grid, Paper, Button, Typography } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { blue } from '@mui/material/colors';
import HotelsList from './HotelsList';

export default function Home() {
    const { user, setUser } = useContext(UserContext);
    const [posts, setPosts] = useState("");
    
    function createMarkup(post) { return {__html: post}; };

    const postsCollectionRef = collection(db, "posts");

    const getPosts = async() => {                
        const data = await getDocs(postsCollectionRef);
        const postsArray = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
        setPosts(postsArray); 
        console.log(postsArray)            
    };

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
                    <Grid item className={'slider'} sm={12} 
                    // sx={{ display: 'flex', flexDirection: 'column'}}
                    >
                        <Box sx={{ maxWidth: '95%' }}>
                            <Slider 
                                // ref={slider}
                                fade={true}
                                arrows={false}                            
                                // centerMode={true} 
                                // variableWidth={true}
                                rows={1}
                                // adaptiveHeight={true} 
                                autoplay={true}                                                                  
                            >

                                <div  
                                    
                                    // sx={{ mr: coef }}                  
                                    style={{ position: 'relative'}}
                                    
                                >   
                                    <Typography variant="h3" sx={{ ml: 'auto', mr: 'auto', mt: 3 }} 
                                        style={{ position: 'absolute', top: '0', left: '30px'}}
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
                                    <Typography variant="h3" sx={{ ml: 'auto', mr: 'auto', mt: 3 }}
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
                                    <Typography variant="h3" sx={{ ml: 'auto', mr: 'auto', mt: 3 }}
                                        style={{ position: 'absolute', top: '0', left: '30px' }} 
                                        color="rgba(255, 255, 255, 1)" fontFamily={'Merriweather'} fontWeight={300}
                                    >
                                        Discower treasures of misterious Egypt
                                    </Typography>
                                    
                                    <img src={'/images/slide3.jpg'} key={3} alt={"Sharm El Sheikh"} height={'450px'} />
                                    
                                </div>

                                <div                                                 
                                    style={{ position: 'relative' }}                                     
                                >
                                    <Typography variant="h3" sx={{ ml: 'auto', mr: 'auto', mt: 3 }}
                                        style={{ position: 'absolute', top: '0', left: '30px' }} 
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
                        <HotelsList /> 
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