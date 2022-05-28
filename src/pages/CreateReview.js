import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import {collection, addDoc } from "firebase/firestore";
import {auth, db} from "../firebase-config";
import { UserContext  } from '../App';
import { Box, Button, TextField, Typography } from '@mui/material';

export default function CreateReview() {
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewText, setReviewText] = useState("");
    const {user} = useContext(UserContext);

    useEffect(() => {
        !user.userName && navigate("/");
    });

    const navigate = useNavigate();
    const reviewsCollectionRef = collection(db, "reviews");
    
    const createReview = async () => {
        await addDoc(reviewsCollectionRef, {
            reviewTitle, 
            reviewText, 
            author: {name: auth.currentUser.email, id: auth.currentUser.uid}
        });
        navigate("/"); 
    };

    

    return (
    <Box className="createPostPage">        
        <Typography variant="h5">Create A Review</Typography>
        <Box className="inputPost">
            <Typography variant="h6">Title:</Typography>
            <TextField placeholder='Review title' value={reviewTitle}
                onChange={event => setReviewTitle(event.target.value)}/>
        
        <Typography variant="h6">Review:</Typography>
            <TextField placeholder='Review text'
                value={reviewText} multiline rows={6}
                onChange={event => setReviewText(event.target.value)}/>
        </Box>
        <Button size="small" variant="outlined" onClick={createReview}>Add a review</Button>
        
    </Box>
    )
}