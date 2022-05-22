import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import {collection, addDoc } from "firebase/firestore";
import {auth, db} from "../firebase-config";

export default function CreateHotel({ isAdmin }) {
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewText, setReviewText] = useState("");
    

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

    useEffect(() => {
        !isAdmin && navigate("/");
    })

    return (
    <div className="createPostPage">
        <div className="createContainer">
            <h3>Create A Review</h3>
            <div className="inputPost">
                <h5>Title:</h5>
                <input placeholder='Review title' value={reviewTitle}
                    onChange={event => setReviewTitle(event.target.value)}/>
            </div>
            <div className="inputPost">
            <h5>Review:</h5>
                <textarea placeholder='Review text' value={reviewText}
                    onChange={event => setReviewText(event.target.value)}/>
            </div>
            <button onClick={createReview}>Add a review</button>
        </div>
    </div>
    )
}