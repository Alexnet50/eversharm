import React, { useState, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from "firebase/firestore";
import {auth, db} from "../firebase-config";
import { UserContext } from '../App';
import { Button } from "@mui/material";

let key = 0;
export default function Home() {
    const [reviews, setReviews] = useState([]);
    const reviewsRef = collection(db, 'reviews');
    const {user, setUser} = useContext(UserContext);

    
    const getReviews = async() => {
        const data = await getDocs(reviewsRef);
        setReviews(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    };

    const deleteHandler = async (id) => {
        const reviewDoc = doc(db, "reviews", id);
        await deleteDoc(reviewDoc);
        getReviews();
    };    

    useEffect(() => {        
        getReviews();
    }, []); 

    
    return (<div>
        {/* {localStorage.getItem("email") && <button onClick={logOut}>Log out</button>} */}

        {reviews.map((review => {
            key++;
                return (
                    <div className="review" key={key}>
                        <h3>Name: {review.author.name}</h3>
                        <h4>Title: {review.reviewTitle}</h4>
                        <p>Text: {review.reviewText}</p>
                        
                        {user && review.author.name === user  
                            && <Button onClick={() => deleteHandler(review.id)}>Delete review</Button>}
                    </div>
                    
                )
            }))}
    </div>

    
    )
}