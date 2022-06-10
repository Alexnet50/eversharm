import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
// import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import {collection, getDocs, deleteDoc, doc} from "firebase/firestore";
import {db} from "../firebase-config";
import { UserContext } from '../App';
import { Box, Button, Typography, Grid, Paper, Chip } from "@mui/material";
import ColoredNumber from './ColoredNumber';
import Stars from './Stars';
import Review from './Review';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider, { Settings } from "react-slick";
import styled from 'styled-components';
import Icons from './Icons';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';


let key = 0;

export default function Hotel(props) {
    const {user, setUser} = useContext(UserContext);
    const [hotels, setHotels] = useState();    
    const [hotel, setHotel] = useState();     
    
    const [location, setLocation] = useState(0);
    const [food, setFood] = useState(0);
    const [cleanliness, setCleanliness] = useState(0);
    const [service, setService] = useState(0);    

    const navigate = useNavigate();
    const hotelsCollectionRef = collection(db, "hotels");

    const getHotels = async () => {  
        const data = await getDocs(hotelsCollectionRef);
        const hotelsArray = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
        setHotels(hotelsArray);
        let currentHotel = hotelsArray.find(item => item.id == user.currentHotel)
        
        setHotel(() => {return currentHotel });
        
        getAverageRatings(currentHotel.reviewsList);             
    };

    const getAverageRatings = (reviewsArray) => {        
        let locationAcc = 0;
        let foodAcc = 0;
        let cleanlinessAcc = 0;
        let serviceAcc = 0;
        let length = reviewsArray.length;
        reviewsArray.forEach((review) => {            
            locationAcc += review.location;
            foodAcc += review.food;
            cleanlinessAcc += review.cleanliness;
            serviceAcc += review.cleanliness;
        });        
        setLocation(Math.floor((locationAcc / length) * 10) / 10);
        setFood(Math.floor((foodAcc / length) * 10) / 10);
        setCleanliness(Math.floor((cleanlinessAcc / length) * 10) / 10);
        setService(Math.floor((serviceAcc / length) * 10) / 10);
    };     

    useEffect(() => {
        getHotels();        
    }, []); 


    const addReviewHandler = () => {
        if (user.currentUser) {
            navigate("/createreview")
        }  else {
            setUser((prev) => ({ ...prev, 
                modalContent: 
                <>
                    <Typography sx={{ m: 2 }} variant='h5' >To add a review you must log in first</Typography>
                    <Button onClick={closeModal} sx={{ ml: '80%'}} >OK</Button>
                </>
                ,
                openModal: true 
            }))             
        }
    }

    const closeModal = () => {setUser((prev) => ({ ...prev, openModal: false}))};

    function createMarkup() { if (hotel) return {__html: hotel.hotelDescription}; };
    
    const slider = React.useRef(null);    

    return (
        <>
            {hotel &&
                <Box key={props.key} sx={{ m: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' }}>              
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <Typography variant="h4" sx={{ mr: 2, mt: 1 }} fontWeight="bold" color="primary" >
                            {hotel.hotelName}
                        </Typography>
                        <Box sx={{ mt: 2, width: '150px'}}>
                            <Stars stars={hotel.stars} />
                        </Box>                    
                    </Box>
                    <Paper 
                        sx={{ pl: 2, pr: 2, width: '170px', display: 'flex', flexDirection: 'row', 
                        flexShrink: 0, alignItems: 'center', borderRadius: '20px' }}
                        elevation={3}
                    >                    
                        <ColoredNumber number={hotel.rating ? hotel.rating : "-"} size={"h3"} /> 
                        <Typography variant='subtitle2' color="text.secondary" sx={{ ml: 1 }}>{hotel.reviewsList.length} reviews</Typography>
                    </Paper>
                                
                </Box>
            }

            {hotel &&                              
                <Grid container spacing={3}>                    
                    <Grid item                                     
                        xs={12} md={9}
                        sx={{ p: 2, display: 'flex', flexDirection: 'row', alignItems: 'center' }}
                    >                           
                        <ArrowBackIosNewIcon 
                            onClick={() => slider?.current?.slickNext()} color='primary' 
                        >
                            Prev
                        </ArrowBackIosNewIcon>
                        
                        <Box sx={{ maxWidth: '95%' }}>
                            <Slider 
                                ref={slider}
                                arrows={false}                            
                                centerMode={true} variableWidth={true}
                                rows={1}
                                adaptiveHeight={true}                                                                    
                            >
                                {hotel && hotel.imageList.map((url) => {
                                    key++;                                            
                                    return (                                    
                                        <img src={url} key={key}
                                            height={'350px'}
                                            sx={{ m: 1 }}
                                            />                                                                               
                                    )                                                      
                                })} 
                                
                            </Slider> 
                        </Box>
                        <ArrowForwardIosIcon 
                            onClick={() => slider?.current?.slickPrev()} color='primary'
                        >
                            Next
                        </ArrowForwardIosIcon> 
                        
                    </Grid>                              
                                                                   
                    <Grid item xs={12} md={3}
                        sx={{                         
                            display: 'flex', flexDirection: 'column',
                            alingnItems: 'center', justifyContent: 'space-between'
                        }}
                    >
                        <Paper elevation={3} sx={{ mb: 3, p: 2, display: 'flex', flexDirection: 'column' }}> 
                            
                            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant='h6' color="text.secondary" fontWeight="bold" sx={{ mr: 2 }}>
                                    Location
                                </Typography>
                                <ColoredNumber number={location ? location : "-"} size={"h4"} /> 
                            </Box>

                            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant='h6' color="text.secondary" fontWeight="bold" sx={{ mr: 2 }}>
                                    Food
                                </Typography>
                                <ColoredNumber number={food ? food : "-"} size={"h4"} /> 
                            </Box>

                            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant='h6' color="text.secondary" fontWeight="bold" sx={{ mr: 2 }}>
                                    Cleanliness
                                </Typography>
                                <ColoredNumber number={cleanliness ? cleanliness : "-"} size={"h4"} /> 
                            </Box>

                            <Box sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Typography variant='h6' color="text.secondary" fontWeight="bold" sx={{ mr: 2 }}>
                                    Service
                                </Typography>
                                <ColoredNumber number={service ? service : "-"} size={"h4"} /> 
                            </Box>                        

                            <Button variant="outlined" 
                                onClick={addReviewHandler}
                                sx={{ ml: 'auto', mr: 'auto', mt: 2, mb:2, width: '150px' }}
                            >
                                Add a review
                            </Button> 
                        </Paper> 
                    </Grid>

                    {/* <Grid item xs={12} sm={6} md={2}
                        sx={{                            
                            display: 'flex', flexDirection: 'column',
                            alingnItems: 'center', justifyContent: 'space-between'
                        }}>
                            <Paper sx={{ width: '100%', height: '100%', overflow: 'hidden'}}>
                                <img src={santorini} style={{ height: '500px'}}></img>
                            </Paper>
                    </Grid>                                                       */}
                            
                </Grid>                 
                
            }

        <Grid container spacing={3}>
            <Grid item xs={12} sm={7}>
                <Paper sx={{ p: 1, mb: 2 }} elevation={5}>
                    <Icons hotel={hotel} coef={2} />
                </Paper >

                <Paper sx={{ p: 2, mb: 2 }} elevation={2}>
                    <Typography>{hotel?.hotelSummary}</Typography>
                </Paper >
                <Paper sx={{ p: 2, mb: 2 }} elevation={2}>
                    <div dangerouslySetInnerHTML={createMarkup()} />
                </Paper>
                
                
            </Grid>

            <Grid item xs={12} sm={5}>
                {/* {console.log(hotel)} */}
                {hotel && 
                hotel.reviewsList.map((review => {
                    key++;
                        return (
                            <Review key={key} review={review} hotel={hotel} callback={getHotels}/>                                   
                        )
                    }))}
            </Grid>

        </Grid>
         
        </>
        
        
    )
}