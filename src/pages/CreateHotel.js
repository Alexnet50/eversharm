import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import {collection, addDoc, getDocs, doc, deleteDoc } from "firebase/firestore";
import { v4 } from "uuid";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase-config";
import { UserContext } from '../App';
import { Box, Typography, FormGroup, FormControlLabel,
     Checkbox, TextField, FormControl, InputLabel, Select,
     MenuItem, Button, Grid, IconButton
 } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { Editor } from '@tinymce/tinymce-react';

 let key = 0;

 
export default function CreateHotel() {
    const {user, setUser} = useContext(UserContext);
    const [hotel, setHotel] = useState();
    const [hotels, setHotels] = useState();
    const [hotelName, setHotelName] = useState("");
    const [hotelSummary, setHotelSummary] = useState("");
    const [hotelDescription, setHotelDescription] = useState("");
    const [stars, setStars] = useState("");
    const [line, setLine] = useState("");
    const [warmPool, setWarmPool] = useState(false);
    const [aquapark, setAquapark] = useState(false);
    const [kidsClub, setKidsClub] = useState(false);
    const [imagesUpload, setImagesUpload] = useState(null);    
    const [imageList, setImageList] = useState([]);
    const [reviewsList, setReviewsList] = useState([]);
    const [rating, setRating] = useState(null);

    const editorRef = useRef(null);
    const editorHandler = () => {
        if (editorRef.current) {
        setHotelDescription(editorRef.current.getContent());
        }
    };


    // const imageListRef = ref(storage, "images/")

    const navigate = useNavigate();
    const hotelsCollectionRef = collection(db, "hotels");

    const getHotel = async() => {  
        const data = await getDocs(hotelsCollectionRef);
        const hotelsArray = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
        setHotels(hotelsArray);
        
        if (user.currentHotel) {
            let editableHotel = hotelsArray.find(hotel => hotel.id == user.currentHotel)
            setHotel(editableHotel); 
            formFill(editableHotel);  
        }
        // console.log(hotelsArray)        
         
                    
    };

    const formFill = async(hotel) => {
        if (user.currentHotel === null) return;
        

        // const hotelDoc = doc(db, "hotels", user.currentHotel);
        // const hotelData = await getDoc(hotelDoc);
        // const hotelFields = hotelData._document.data.value.mapValue.fields;
        if (hotel) {
            setHotelName(hotel.hotelName);
            setHotelSummary(hotel.hotelSummary);
            setHotelDescription(hotel.hotelDescription);
            setStars(hotel.stars);
            setLine(hotel.line);
            setAquapark(hotel.aquapark);
            setWarmPool(hotel.warmPool);
            setKidsClub(hotel.kidsClub);
            setImageList(hotel.imageList); 
            setReviewsList(hotel.reviewsList);
            setRating(hotel?.rating);
        }
        
        /////////
        console.log(hotel)
    };
    
    useEffect(() => {
        !user.isAdmin && navigate("/");
        getHotel();        
    },[]);
    
    const createHandler = async () => {        
        await addDoc(hotelsCollectionRef, {
            hotelName,
            hotelSummary,           
            hotelDescription, 
            stars,
            line,
            warmPool,
            aquapark,
            kidsClub,
            imageList,
            reviewsList,
            rating
        });
        navigate("/"); 
    };

    const saveHandler = async () => {
        const hotelDoc = doc(db, "hotels", user.currentHotel);
        await deleteDoc(hotelDoc);       
        setUser((prev) => ({...prev, currentHotel: null}));
        createHandler();
    };

    const deleteHandler = async () => {        
        const hotelDoc = doc(db, "hotels", user.currentHotel);
        await deleteDoc(hotelDoc);       
        setUser((prev) => ({...prev, currentHotel: null}));
        navigate("/"); 
    };  

    const cancelHandler = () => {            
        setUser((prev) => ({...prev, currentHotel: null}));
        navigate("/"); 
    };  

    const uploadImage = () => {
        if (imagesUpload == null) return;
            
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

    

    const clearHandler = () => {
        setHotelName("");
        setHotelSummary("");
        setHotelDescription("");
        setStars();
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
                    id="editedField" 
                    placeholder="Hotel summary" 
                    size="small" 
                    value={hotelSummary}
                    sx={{
                        m: 1
                    }}
                    onChange={event => setHotelSummary(event.target.value)}
                    multiline
                    rows={6}
                />

                <Editor
                    apiKey='xnkep1e83iv4c4o42kq6tu0te8ail8r5o8x5zgqmtoue25xl'
                    onInit={(evt, editor) => editorRef.current = editor}
                    onChange={editorHandler}
                    initialValue={hotelDescription}
                    init={{
                    height: 500,
                    menubar: false,
                    plugins: [
                        
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                    content_style: 'body { font-family:Helvetica,Arial,Roboto,sans-serif; font-size:14px }'
                    }}
                />
                {/* <button onClick={log}>Log editor content</button> */}
                {/* <TextField 
                    id="editedField" 
                    placeholder="Hotel description" 
                    size="small" 
                    value={hotelDescription}
                    sx={{
                        m: 1
                    }}
                    onChange={event => setHotelDescription(event.target.value)}
                    multiline
                    rows={12}
                /> */}
                
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
                
                {user.currentHotel 
                    ?
                        <Button variant="contained"
                        sx={{
                            m: 1,
                            width: 200
                        }}
                        onClick={saveHandler}>
                            Save a hotel page
                        </Button> 
                    :
                        <Button variant="contained"
                        sx={{
                            m: 1,
                            width: 200
                        }}
                        onClick={createHandler}>
                            Create a hotel page
                        </Button> 
                }                

                <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                    <Button variant="outlined" 
                        sx={{
                            m: 1,
                            width: 200
                        }}
                        onClick={cancelHandler}>
                            Cancel
                    </Button>

                    {user.currentHotel &&
                        <Button variant="contained" 
                        sx={{
                            m: 1,
                            width: 200
                        }}
                        onClick={deleteHandler}>
                            Delete a hotel
                        </Button>
                    }

                    <Button variant="outlined" 
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
                                    <CancelIcon color="error" />
                                </IconButton>                           
                            </Grid>                        
                        )                             
                    })}                
                </Grid>
            </Grid>
        </Grid>

    
    )
}