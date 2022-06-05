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

    useEffect(() => {         
        setUser((prev) => ({...prev, currentHotel: null}));
        getReviews();
    }, []); 

    
    return (
        <Box> 
            <HotelsList />

            
        </Box>    
    )
}