import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import {collection, addDoc } from "firebase/firestore";
import { v4 } from "uuid";
import { ref, uploadBytes, listAll, getDownloadURL, list } from "firebase/storage";
import {auth, db, storage} from "../firebase-config";

export default function CreateHotel({ isAdmin, setImageList }) {
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [imageUpload, setImageUpload] = useState(null);

    const imageListRef = ref(storage, "images/")

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

    const uploadImage = () => {
        if (imageUpload == null) return;
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageList((prev) => [...prev, url])
            })
        })
    }

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

            <input type="file" onChange={(event) => setImageUpload(event.target.files[0])} />
            <button onClick={uploadImage}>Upload image</button>

            <button onClick={createReview}>Add a review</button>
        </div>
    </div>
    )
}