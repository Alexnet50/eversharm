import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
// import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import {collection, getDocs, deleteDoc, doc} from "firebase/firestore";
import {db} from "../firebase-config";
import { UserContext } from '../App';
import { Box, Button, Typography, Grid, Paper, Chip } from "@mui/material";
import HotelsList from './HotelsList';

let key = 0;

export default function Hotel() {
    const {user, setUser} = useContext(UserContext);
    const [hotels, setHotels] = useState();    
    const [hotel, setHotel] = useState();    

    const navigate = useNavigate();
    const hotelsCollectionRef = collection(db, "hotels");

    const getHotels = async () => {  
        const data = await getDocs(hotelsCollectionRef);
        const hotelsArray = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
        let newHotel = hotelsArray.find(item => item.id == user.currentHotel)
        
        setHotel(
            () => {        
                return newHotel
            }
        );
        setHotels(hotelsArray);          
    };

    useEffect(() => {
        getHotels();
    }, []); 


    return (
        <>
            <Box sx={{ m: 2 }}>
                {hotel &&
                    <Typography variant="h5">{hotel.hotelName}</Typography>
                }
            </Box>
            <Box sx={{ m: 2 }}>
                {hotel && 
                    <Grid container spacing={1}>
                        {hotel.imageList.map((url) => {
                            {key++} 
                            return (
                                <Grid item key={key}>
                                    <img src={url} style={{ maxWidth: 300}}/>                                                   
                                </Grid>                        
                            )                             
                        })}                
                    </Grid>
                }
            </Box>

            <Box>
                {/* {console.log(hotel)} */}
                {hotel && 
                hotel.reviewsList.map((review => {
                    key++;
                        return (
                            <Paper key={key} sx={{ m: 1, p: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', fontFamily: 'helvetica' }}>
                                    <Typography variant='subtitle1' color="text.secondary" fontWeight="bold">{review.reviewAuthor}</Typography>
                                    <Typography variant='h4' color="success.light" fontWeight="700" >{review.overall}</Typography>
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