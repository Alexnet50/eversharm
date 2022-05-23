import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, useNavigate } from "react-router-dom";
import {collection, addDoc } from "firebase/firestore";
import { v4 } from "uuid";
import { ref, uploadBytes, listAll, getDownloadURL, list } from "firebase/storage";
import {auth, db, storage} from "../firebase-config";
import { UserContext } from '../App';
import { Box, Typography, FormGroup, FormControlLabel,
     Checkbox, TextField, FormControl, InputLabel, Select,
     MenuItem, Button, TextareaAutosize
 } from '@mui/material';

export default function CreateHotel() {
    const [hotelName, setHotelName] = useState("");
    const [hotelDescription, setHotelDescription] = useState("");
    const [stars, setStars] = useState();
    const [line, setLine] = useState();
    const [warmPool, setWarmPool] = useState();
    const [aquapark, setAquapark] = useState();
    const [kidsClub, setKidsClub] = useState();
    const [imageUpload, setImageUpload] = useState(null);
    const {isAdmin, setIsAdmin} = useContext(UserContext);
    const [imageList, setImageList] = useState([]);

    const imageListRef = ref(storage, "images/")

    const navigate = useNavigate();
    const hotelsCollectionRef = collection(db, "hotels");
    
    const createHotel = async () => {
        await addDoc(hotelsCollectionRef, {
            hotelName, 
            hotelDescription, 
            stars,
            line,
            warmPool,
            aquapark,
            kidsClub
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
    <Box className="createHotelPage">
        {/* <div className="createContainer"> */}
            <Typography
                variant="h5"
                sx={{
                    fontWeight: 700
                }}
            >
                Create A New Hotel Page
            </Typography>
            
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">


            </FormControl>
            <TextField placeholder="Hotel name" size="small" value={hotelName}
                onChange={event => setHotelName(event.target.value)}
            />
            <TextField 
                placeholder="Hotel description" 
                size="small" 
                value={hotelDescription}
                onChange={event => setHotelDescription(event.target.value)}
                multiline
                rows={4}
            />
            
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel>Stars</InputLabel>
                <Select                    
                    id="stars"
                    value={stars}
                    label="Stars"
                    onChange={event => setStars(event.target.value)}
                >
                    <MenuItem value={2}>2*</MenuItem>
                    <MenuItem value={3}>3*</MenuItem>
                    <MenuItem value={4}>4*</MenuItem>
                    <MenuItem value={5}>5*</MenuItem>
                </Select>
            </FormControl>

            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                <InputLabel>Line from the shore</InputLabel>
                <Select                    
                    id="line"
                    sx={{ width: 200}}
                    value={line}
                    label="Line"
                    onChange={event => setLine(event.target.value)}
                >
                    <MenuItem value={1}>1-st line</MenuItem>
                    <MenuItem value={2}>2-nd line</MenuItem>
                    <MenuItem value={3}>3-rd line or further</MenuItem>                    
                </Select>
            </FormControl>

            <FormGroup>
                <FormControlLabel control={<Checkbox 
                    onChange={event => setWarmPool(event.target.value)}
                />} label="Heated swimming pool" />
                <FormControlLabel control={<Checkbox
                    onChange={event => setAquapark(event.target.value)}
                />} label="Aquapark or water slides" />
                <FormControlLabel control={<Checkbox 
                    onChange={event => setKidsClub(event.target.value)}
                />} label="Kids club" />
            </FormGroup>           

            <TextField type="file" onChange={(event) => setImageUpload(event.target.files[0])} />
            <Button variant="outlined" onClick={uploadImage}>Upload image</Button>

            <Button variant="outlined" onClick={createHotel}>Create hotel page</Button>
        {/* </div> */}
    </Box>
    )
}