import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import {collection, addDoc } from "firebase/firestore";
import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL, getStorage, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase-config";
import { UserContext } from '../App';
import { Box, Typography, FormGroup, FormControlLabel,
     Checkbox, TextField, FormControl, InputLabel, Select,
     MenuItem, Button, Container, Paper, Grid
 } from '@mui/material';

 let key = 0;

export default function CreateHotel() {
    const {user} = useContext(UserContext);
    const [hotelName, setHotelName] = useState("");
    const [hotelDescription, setHotelDescription] = useState("");
    const [stars, setStars] = useState("");
    const [line, setLine] = useState("");
    const [warmPool, setWarmPool] = useState(null);
    const [aquapark, setAquapark] = useState(null);
    const [kidsClub, setKidsClub] = useState(null);
    const [imageUpload, setImageUpload] = useState(null);    
    const [imageList, setImageList] = useState([]);
    const [refresh, setRefresh] = useState(0);

    // const imageListRef = ref(storage, "images/")

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
            kidsClub,
            imageList
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

    const deleteImgHandler = async (url) => {
        try {
            const imageRef = ref(storage, url);          
            deleteObject(imageRef);
            let list = imageList;
            const index = list.findIndex(item => item === url);
            list.splice(index, 1);
            // setImageList(null);
            setImageList(() => (list));
            setRefresh((prev) => prev++);
        }
        
        catch(error) {
            console.log("Deleting error!");
        }
          

    }

    useEffect(() => {
        !user.isAdmin && navigate("/");
        
    })

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} md={7} sx={{ display: 'flex', flexDirection: 'column'}}>        
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 700
                    }}
                >
                    Create A New Hotel Page
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

                <TextField type="file" 
                    sx={{
                        m: 1,
                        width: 400
                    }}                     
                    onChange={(event) => setImageUpload(event.target.files[0])} 
                />

                <Button variant="outlined" 
                    sx={{
                        m: 1,
                        width: 200
                    }}
                    onClick={uploadImage}>Upload image
                </Button>

                <Button variant="outlined"
                    sx={{
                        m: 1,
                        width: 200
                    }}
                    onClick={createHotel}>Create hotel page
                </Button>            
            </Grid>

            <Grid item xs={12} md={5} sx={{ minWidth: 300, mt: 2}}>
                <Grid container spacing={1}>
                {imageList.map((url) => {
                    {key++} 
                    return (
                        <Grid item key={key}>
                            <img src={url} style={{ maxWidth: 300}}/>
                            <Button 
                                variant="outlined"
                                size="small"
                                onClick={() => deleteImgHandler(url)}
                            >
                                X
                            </Button>
                        </Grid>
                        // <Grid item xs={12} md={6} key={key} justify="space-between"  
                        // style={{backgroundImage: `url(${url})`,   
                        //  width:'200px',
                        // //   marginTop: 20, 
                        //   backgroundSize:'contain',
                        //   backgroundRepeat: 'no-repeat'
                        //   }}>
                        // </Grid> xs={12} lg={7} 
                        
                    )                             
                })}                
                </Grid>
            </Grid>
        </Grid>

    
    )
}