import React, { useState, useContext, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import {collection, getDocs, deleteDoc, doc} from "firebase/firestore";
import {db} from "../firebase-config";
import { UserContext } from '../App';
import { Box, Button, Typography } from "@mui/material";
import HotelsList from './HotelsList';

let key = 0;
export default function Home() {
    const {user, setUser} = useContext(UserContext);
    const [reviews, setReviews] = useState([]);
    const reviewsRef = collection(db, 'reviews');
    

    
    const getReviews = async() => {
        const data = await getDocs(reviewsRef);
        setReviews(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    };

    const deleteHandler = async (id) => {
        const reviewDoc = doc(db, "reviews", id);
        await deleteDoc(reviewDoc);
        getReviews();
    };    

    useEffect(() => {         
        setUser((prev) => ({...prev, currentHotel: null}));
        getReviews();
    }, []); 

    
    return (
        <Box> 
            <HotelsList />

            {/* {reviews.map((review => {
                key++;
                    return (
                        <Box className="review" key={key} sx={{ m: 1, p: 2, border: '1px solid' }}>
                            <Typography variant='subtitle1' color="text.secondary">{review.author.name}</Typography>
                            <Typography variant='h6'>{review.reviewTitle}</Typography>
                            <Typography variant='body1' sx={{ m: 1 }}>{review.reviewText}</Typography>
                            
                            {user.userName && review.author.name === user.userName  
                                && <Button onClick={() => deleteHandler(review.id)}>Delete review</Button>}
                        </Box>                        
                    )
                }))} */}
        </Box>    
    )
}