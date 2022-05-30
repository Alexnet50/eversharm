import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
// import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import {collection, getDocs, deleteDoc, doc} from "firebase/firestore";
import {db} from "../firebase-config";
import { UserContext } from '../App';
import { Box, Button, Typography } from "@mui/material";
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
        console.log(hotelsArray)
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
        <Box>
            {console.log(hotel)}
            {hotel && 
            hotel.reviewsList.map((review => {
                key++;
                    return (
                        <Box className="review" key={key} sx={{ m: 1, p: 2, border: '1px solid' }}>
                            <Typography variant='subtitle1' color="text.secondary">{review.authorName}</Typography>
                            <Typography variant='h6'>{review.reviewTitle}</Typography>
                            <Typography variant='body1' sx={{ m: 1 }}>{review.reviewText}</Typography>
                            
                            {user.userName && review.reviewAuthor === user.userName  
                                && <Button 
                                // onClick={() => deleteHandler(review.id)}
                                >
                                    Delete review
                                </Button>}
                        </Box>                        
                    )
                }))}
        </Box>    
        
    )
}