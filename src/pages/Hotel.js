import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
// import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import {collection, getDocs, deleteDoc, doc} from "firebase/firestore";
import {db} from "../firebase-config";
import { UserContext } from '../App';
import { Box, Button, Typography, Grid, Paper, Chip } from "@mui/material";
import ColoredNumber from './ColoredNumber';
import Stars from './Stars';
import StarIcon from '@mui/icons-material/Star';
import { yellow } from '@mui/material/colors';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import hotelImage from '../images/hotel.jpg'

let key = 0;

export default function Hotel() {
    const {user, setUser} = useContext(UserContext);
    const [hotels, setHotels] = useState();    
    const [hotel, setHotel] = useState(); 
    
    // const [overall, setOverall] = useState(0);
    const [location, setLocation] = useState(0);
    const [food, setFood] = useState(0);
    const [cleanliness, setCleanliness] = useState(0);
    const [service, setService] = useState(0);

    const navigate = useNavigate();
    const hotelsCollectionRef = collection(db, "hotels");

    const getHotels = async () => {  
        const data = await getDocs(hotelsCollectionRef);
        const hotelsArray = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
        let currentHotel = hotelsArray.find(item => item.id == user.currentHotel)
        
        setHotel(() => {        
                return currentHotel;
            }
        );
        
        getAverageRatings(currentHotel.reviewsList);
        // setHotels(hotelsArray);          
    };

    const getAverageRatings = (reviewsArray) => {
        // let overallAcc = 0;
        let locationAcc = 0;
        let foodAcc = 0;
        let cleanlinessAcc = 0;
        let serviceAcc = 0;
        let length = reviewsArray.length;
        reviewsArray.forEach((review) => {
            // overallAcc += review.overall;
            locationAcc += review.location;
            foodAcc += review.food;
            cleanlinessAcc += review.cleanliness;
            serviceAcc += review.cleanliness;
        })
        // setOverall(Math.floor((overallAcc / length) * 10) / 10);
        setLocation(Math.floor((locationAcc / length) * 10) / 10);
        setFood(Math.floor((foodAcc / length) * 10) / 10);
        setCleanliness(Math.floor((cleanlinessAcc / length) * 10) / 10);
        setService(Math.floor((serviceAcc / length) * 10) / 10);
    }

    useEffect(() => {
        getHotels();
        console.log(hotel)
    }, []); 

    const addReviewHandler = () => {
        user.userName ? navigate("/createreview") : alert("To add a review you must log in first.")
    }

    

    return (
        <>
            {hotel &&
            <Box sx={{ m: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>              
                <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Typography variant="h4" sx={{ mr: 2, mt: 1 }} fontWeight="bold" color="primary" >
                        {hotel.hotelName}
                    </Typography>
                    <Box sx={{ mt: 2, width: '150px'}}>
                        <Stars stars={hotel.stars} />
                    </Box>                    
                </Box>
                <Paper 
                    sx={{ pl: 2, pr: 2, width: '150px', display: 'flex', flexDirection: 'row', 
                    alignItems: 'center', borderRadius: '20px' }}
                    elevation={3}
                >
                    {/* <Typography variant='subtitle1' color="text.secondary" fontWeight="bold" sx={{ mr: 1 }}>Rating</Typography> */}
                    <ColoredNumber number={hotel.rating} size={"h3"} /> 
                    <Typography variant='subtitle2' color="text.secondary" sx={{ ml: 1 }}>{hotel.reviewsList.length} reviews</Typography>
                </Paper>
                             
            </Box>
            }

            {hotel && 
                <div 
                // height={'100px'}
                 style={{
                    // m: 2, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between'
                    // height: '100%'
                    }} 
                 >                
                    {/* // <Grid container spacing={3}>
                        
                    //             <Grid item                                     
                    //                 xs={12} md={9}
                    //                 sx={{ p: 2 }}
                    //             > */}
                                {/* <Box sx={{ maxWidth: '700px' }}> */}
                                    <Slider autoplay={false} fade={false} 
                                        centerMode={true} variableWidth={true}
                                        rows={1}
                                        adaptiveHeight={true}
                                        // centerMode={true}
                                        // centerPadding={'10px'}
                                        // wariableWidth={true}
                                        >
                                        {hotel && hotel.imageList.map((url) => {
                                            key++;                                            
                                            return (
                                                // <div key={key}>
                                                    <img src={url} key={key}
                                                     height={'350px'}
                                                    
                                                       />
                                                // </div>                                            
                                            )                                                      
                                        })} 
                                    </Slider>
                                {/* </Box>                             */}
                                {/* // </Grid>  */}
                       
                                
                                                                   
                                {/* // <Grid item xs={12} md={3}
                                //     sx={{ 
                                        
                                //         display: 'flex', flexDirection: 'column',
                                //         alingnItems: 'center', justifyContent: 'space-between'
                                //     }}> */}
                                    <Paper elevation={3} sx={{ ml: 1, mt: 1, mb: 'auto', p: 4, display: 'flex', flexDirection: 'column' }}> 
                                        
                                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Typography variant='h6' color="text.secondary" fontWeight="bold" sx={{ mr: 2 }}>
                                                Location
                                            </Typography>
                                            <ColoredNumber number={location} size={"h4"} /> 
                                        </Box>

                                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Typography variant='h6' color="text.secondary" fontWeight="bold" sx={{ mr: 2 }}>
                                                Food
                                            </Typography>
                                            <ColoredNumber number={food} size={"h4"} /> 
                                        </Box>

                                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Typography variant='h6' color="text.secondary" fontWeight="bold" sx={{ mr: 2 }}>
                                                Cleanliness
                                            </Typography>
                                            <ColoredNumber number={cleanliness} size={"h4"} /> 
                                        </Box>

                                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Typography variant='h6' color="text.secondary" fontWeight="bold" sx={{ mr: 2 }}>
                                                Service
                                            </Typography>
                                            <ColoredNumber number={service} size={"h4"} /> 
                                        </Box>
                                    

                                    <Button variant="outlined" 
                                        onClick={addReviewHandler}
                                        sx={{ m: 2, width: '150px' }}
                                    >
                                        Add a review
                                    </Button> 
                                    </Paper> 
                    {/* //             </Grid>                                                      
                            
                    // </Grid>                  */}
                </div>
            }

            <Box>
                {/* {console.log(hotel)} */}
                {hotel && 
                hotel.reviewsList.map((review => {
                    key++;
                        return (
                            <Paper key={key} sx={{ m: 1, p: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', pl: 2 }}>
                                    <ColoredNumber number={review.overall} size={"h4"} />

                                    <Typography variant='subtitle1' color="text.secondary" fontWeight="bold" 
                                        sx={{ fontFamily:'helvetica' }}>
                                            {review.reviewAuthor}
                                    </Typography>                              
                                </Box>
                                                                
                                <Typography variant='h6'>{review.reviewTitle}</Typography>
                                <Typography variant='body1' sx={{ m: 1 }}>{review.reviewText}</Typography>
                                
                                {user.userName && review.reviewAuthor === user.userName  
                                    && <Button 
                                    // onClick={() => deleteHandler(review.id)}
                                    >
                                        Delete review
                                    </Button>}
                            </Paper>                        
                        )
                    }))}
            </Box>    
        </>
        
        
    )
}