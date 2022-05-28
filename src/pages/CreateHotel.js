import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import {collection, addDoc, getDoc, doc, deleteDoc } from "firebase/firestore";
import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase-config";
import { UserContext } from '../App';
import { Box, Typography, FormGroup, FormControlLabel,
     Checkbox, TextField, FormControl, InputLabel, Select,
     MenuItem, Button, Grid, IconButton
 } from '@mui/material';
 import CancelIcon from '@mui/icons-material/Cancel';

 let key = 0;

export default function CreateHotel() {
    const {user} = useContext(UserContext);
    const [hotelName, setHotelName] = useState("");
    const [hotelDescription, setHotelDescription] = useState("");
    const [stars, setStars] = useState("");
    const [line, setLine] = useState("");
    const [warmPool, setWarmPool] = useState(false);
    const [aquapark, setAquapark] = useState(false);
    const [kidsClub, setKidsClub] = useState(false);
    const [imagesUpload, setImagesUpload] = useState(null);    
    const [imageList, setImageList] = useState([]);
   


    // const imageListRef = ref(storage, "images/")

    const navigate = useNavigate();
    const hotelsCollectionRef = collection(db, "hotels");
    
    const createHandler = async () => {        
        await addDoc(hotelsCollectionRef, {
            hotelName,           
            hotelDescription, 
            stars,
            line,
            warmPool,
            aquapark,
            kidsClub,
            imageList
        });
        navigate("/"); 
    };

    const saveHandler = async () => {
        const hotelDoc = doc(db, "hotels", user.editableHotel);
        await deleteDoc(hotelDoc);       
        user.editableHotel = null;
        createHandler();
    };

    const deleteHandler = async () => {        
        const hotelDoc = doc(db, "hotels", user.editableHotel);
        await deleteDoc(hotelDoc);       
        user.editableHotel = null;
        navigate("/"); 
    };  

    const cancelHandler = () => {            
        user.editableHotel = null;
        navigate("/"); 
    };  

    const uploadImage = () => {
        if (imagesUpload == null) return;
            console.log(imagesUpload)
        for (let i = 0; i < imagesUpload.length; i++) {            
            const imageRef = ref(storage, `images/${imagesUpload[i].name + v4()}`);
            uploadBytes(imageRef, imagesUpload[i]).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    setImageList((prev) => [...prev, url])
                })
            })     
        }     
    }

    const deleteImgHandler = async (url) => {
        try {
            const imageRef = ref(storage, url);          
            deleteObject(imageRef);
            let list = imageList;
            const index = list.findIndex(item => item === url);
            list.splice(index, 1);            
            setImageList(list);            
            setImagesUpload(key++);
            
        }        
        catch(error) {
            console.log("Deleting error!");
        }
    };

    const formFill = async () => {
        if (user.editableHotel === null) return;
        const hotelDoc = doc(db, "hotels", user.editableHotel);
        const hotelData = await getDoc(hotelDoc);
        const hotelFields = hotelData._document.data.value.mapValue.fields;
        setHotelName(hotelFields.hotelName.stringValue);
        setHotelDescription(hotelFields.hotelDescription.stringValue);
        setStars(hotelFields.stars.integerValue);
        setLine(hotelFields.line.integerValue);
        setAquapark(hotelFields.aquapark.booleanValue);
        setWarmPool(hotelFields.warmPool.booleanValue);
        setKidsClub(hotelFields.kidsClub.booleanValue);
        setImageList(
            hotelFields.imageList.arrayValue.values.map((value) => value.stringValue)
        );        
    };
    
    useEffect(() => {
        !user.isAdmin && navigate("/");
        formFill();
    },[]);

    const clearHandler = () => {
        setHotelName("");
        setHotelDescription("");
        setStars("");
        setLine("");
        setAquapark(false);
        setWarmPool(false);
        setKidsClub(false);
    };

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column'}}>        
                <Typography
                    variant="h5"
                    sx={{
                        ml: 2,
                        mt: 2,
                        color: "text.secondary",
                        fontWeight: 700
                    }}
                >
                    {hotelName ? "Edit A " : "Create A New "}Hotel Page
                </Typography>            
                
                <TextField placeholder="Hotel name" size="small" value={hotelName}
                    sx={{
                        m: 1
                    }}
                    onChange={event => setHotelName(event.target.value)}
                />
                <TextField 
                    placeholder="Hotel description" 
                    size="small" 
                    value={hotelDescription}
                    sx={{
                        m: 1
                    }}
                    onChange={event => setHotelDescription(event.target.value)}
                    multiline
                    rows={6}
                />
                
                <FormControl sx={{ m: 1 }} size="small">
                    <InputLabel>Stars</InputLabel>
                    <Select                    
                        id="stars"
                        sx={{ width: 200}}                    
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

                <FormControl sx={{ m: 1 }} size="small">
                    <InputLabel>Line from the shore</InputLabel>
                    <Select                    
                        id="line"
                        sx={{ width: 200}}
                        value={line}
                        label="Line from the shore"
                        onChange={event => setLine(event.target.value)}
                    >                    
                        <MenuItem value={1}>1-st line</MenuItem>
                        <MenuItem value={2}>2-nd line</MenuItem>
                        <MenuItem value={3}>3-rd line or further</MenuItem>                    
                    </Select>
                </FormControl>

                <FormGroup sx={{ m: 1 }}>
                    <FormControlLabel control={
                        <Checkbox 
                            checked={warmPool}
                            onChange={event => setWarmPool(event.target.checked)}
                        />} 
                        label="Heated swimming pool" 
                    />
                    <FormControlLabel control={
                        <Checkbox
                            checked={aquapark}
                            onChange={event => setAquapark(event.target.checked)}
                        />} 
                        label="Aquapark or water slides" 
                    />
                    <FormControlLabel control={
                        <Checkbox 
                            checked={kidsClub}
                            onChange={event => setKidsClub(event.target.checked)}
                        />} 
                        label="Kids club" />
                </FormGroup>           

                <TextField type="file" 
                    sx={{
                        m: 1,
                        width: 400
                    }} 
                    inputProps={ {multiple: true} }                            
                    onChange={(event) => {
                        setImagesUpload(event.target.files)                        
                    }}                    
                />

                <Button variant="outlined" 
                    sx={{
                        m: 1,
                        width: 200
                    }}
                    onClick={uploadImage}>Upload image
                </Button>
                
                {user.editableHotel 
                    ?
                        <Button variant="outlined"
                        sx={{
                            m: 1,
                            width: 200
                        }}
                        onClick={saveHandler}>
                            Save a hotel page
                        </Button> 
                    :
                        <Button variant="outlined"
                        sx={{
                            m: 1,
                            width: 200
                        }}
                        onClick={createHandler}>
                            Create a hotel page
                        </Button> 
                }                

                <Box sx={{ display: 'flex', flexDirection: 'row'}}>
                    <Button variant="contained" 
                        sx={{
                            m: 1,
                            width: 200
                        }}
                        onClick={cancelHandler}>
                            Cancel
                    </Button>

                    {user.editableHotel &&
                        <Button variant="contained" 
                        sx={{
                            m: 1,
                            width: 200
                        }}
                        onClick={deleteHandler}>
                            Delete a hotel
                        </Button>
                    }

                    <Button variant="contained" 
                        sx={{
                            m: 1,
                            width: 200
                        }}
                        onClick={clearHandler}>
                            Clear form
                    </Button>
                </Box>           
            </Grid>

            <Grid item xs={12} md={5} sx={{ minWidth: 300, mt: 2}}>
                <Grid container spacing={1}>
                    {imageList.map((url) => {
                        {key++} 
                        return (
                            <Grid item key={key} style={{ position: "relative" }}>
                                <img src={url} style={{ maxWidth: 300}}/>
                                <IconButton                                 
                                    style={{ position: "absolute", top: "10px", right: "0" }}
                                    onClick={() => deleteImgHandler(url)}
                                >
                                    <CancelIcon color="error" fontSize="large"/>
                                </IconButton>                           
                            </Grid>                        
                        )                             
                    })}                
                </Grid>
            </Grid>
        </Grid>

    
    )
}