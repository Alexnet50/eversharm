import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import {collection, addDoc, doc, getDoc, getDocs, deleteDoc, updateDoc } from "firebase/firestore";
import {auth, db} from "../firebase-config";
import { UserContext  } from '../App';
import { Box, Button, TextField, Typography, Rating,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material';

let key = 0;

export default function CreateReview() {
    const {user, setUser} = useContext(UserContext);
    // const [hotelName, setHotelName] = useState("");
    // const [hotelDescription, setHotelDescription] = useState("");
    // const [stars, setStars] = useState("");
    // const [line, setLine] = useState("");
    // const [warmPool, setWarmPool] = useState(false);
    // const [aquapark, setAquapark] = useState(false);
    // const [kidsClub, setKidsClub] = useState(false);
    // const [imagesUpload, setImagesUpload] = useState(null);    
    // const [imageList, setImageList] = useState([]);
    // const [reviewsList, setReviewsList] = useState([]);
    const [hotels, setHotels] = useState([]);    
    const [hotel, setHotel] = useState([]);    
        
    const [hotelId, setHotelId] = useState([]);    
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewText, setReviewText] = useState("");    
    const [overall, setOverall] = useState(0);
    const [location, setLocation] = useState(0);
    const [food, setFood] = useState(0);
    const [cleanliness, setCleanliness] = useState(0);
    const [service, setService] = useState(0);
    const [imageList, setImageList] = useState([]);
    const [imagesUpload, setImagesUpload] = useState(null);
    // const [reviewsList, setReviewsList] = useState([]);

    useEffect(() => {
        !user.userName && navigate("/");
    });

    const navigate = useNavigate();
    const hotelsCollectionRef = collection(db, "hotels");

    const getHotels = async() => {  
        const data = await getDocs(hotelsCollectionRef);
        const hotelsArray = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
        setHotels(hotelsArray);        
        user.currentHotel && 
            setHotel(hotelsArray.find(hotel => hotel.id == user.currentHotel));           
    };

    const selectHotelHandler = (event) => {            
            setHotelId(event.target.value);
            setUser((prev) => ({ ...prev, currentHotel: event.target.value })) 
    }
    
    const createReview = async () => {        
        const hotelDoc = doc(db, "hotels", hotel.id);
        const newReviewsList = [...hotel.reviewsList, {
            reviewAuthor: user.userName,
            reviewTitle: reviewTitle,
            reviewText: reviewText,
            overall: overall,
            location: location,
            food: food,
            cleanliness: cleanliness,
            service: service
        }];
        const newImageList = [...hotel.imageList, ...imageList];       
        
        console.log(hotel.id)
        console.log(newReviewsList)
        console.log(newImageList)
        await updateDoc(hotelDoc, { 
            reviewsList: newReviewsList,
            imageList: newImageList
        });
        navigate("/hotel"); 

        

        // await addDoc(reviewsCollectionRef, {
        //     reviewTitle, 
        //     reviewText, 
        //     author: {name: auth.currentUser.email, id: auth.currentUser.uid}
        // });
       
    };
    // const getHotel = async (id) => {
        
    //     const hotelDoc = doc(db, "hotels", id);
    //     const hotelData = await getDoc(hotelDoc);
    //     const hotelFields = hotelData._document.data.value.mapValue.fields;
    //     setHotelName(hotelFields.hotelName.stringValue);   
    //     // const hotelFields = hotelData.docs.data();        
    //     // console.log(hotelFields)
        
    //     // setHotelName(hotelFields.hotelName);      
    // };   


    useEffect(() => {       
        getHotels()        
    }, []);

    const textStyle = {        
        color: "text.secondary"        
    };

    

    return (
    <Box sx={{ m: 1 }}>        
        <Typography variant="h4" style={textStyle}>Create A Review</Typography>

        {user.currentHotel 
            ?
                <Typography variant="h5">{hotel?.hotelName}</Typography> 
            :
                <FormControl sx={{ m: 1 }} size="small">
                    <InputLabel>Select a hotel</InputLabel>
                    <Select  
                        id="line"             
                        sx={{ width: 200}}                    
                        value={hotelId}
                        label="Select a hotel"
                        onChange={selectHotelHandler}
                    >   
                        {hotels &&
                            hotels.map(hotel => {
                                key++;                            
                                return (
                                    <MenuItem key={key} name={hotel.hotelName} value={hotel.id}>{hotel.hotelName}</MenuItem>
                                )
                            })
                        }                   
                    </Select>
                </FormControl>
        }

        <Box 
        sx={{
            '& > legend': { mt: 1 },  
            mb: 2,          
        }}>
            {/* <Typography variant="h5" style={textStyle}>Ratings:</Typography> */}

            <Typography component="legend" variant="h6">Overall rating</Typography>
            <Rating 
                size="large"               
                value={overall}
                onChange={(event, newValue) => {
                setOverall(newValue);
                }}
            />

            <Typography component="legend">Location</Typography>
            <Rating                
                value={location}
                onChange={(event, newValue) => {
                setLocation(newValue);
                }}
            />

            <Typography component="legend">Food</Typography>
            <Rating                
                value={food}
                onChange={(event, newValue) => {
                setFood(newValue);
                }}
            />

            <Typography component="legend">Cleanliness</Typography>
            <Rating                
                value={cleanliness}
                onChange={(event, newValue) => {
                setCleanliness(newValue);
                }}
            />

            <Typography component="legend">Service</Typography>
            <Rating                
                value={service}
                onChange={(event, newValue) => {
                setService(newValue);
                }}
            />
        </Box>

        <Box sx={{ mb: 2 }}>
            <Typography variant="h6" style={textStyle}
            >
                Title:
            </Typography>
            <TextField placeholder='Review title' 
            value={reviewTitle} sx={{ minWidth: 500 }}
                onChange={event => setReviewTitle(event.target.value)}
            />
        
            <Typography variant="h6" style={textStyle}
            >
                Review:
            </Typography>
            <TextField placeholder='Review text'
                value={reviewText} multiline rows={6} sx={{ minWidth: 500 }}
                onChange={event => setReviewText(event.target.value)}
            />
        </Box>

        
        <Box sx={{ display: 'flex', flexDirection: 'column', width: 200}}>
            <Button size="small" variant="outlined" 
                // onClick={uploadImage}
                sx={{ m: 1 }}
            >
                Upload an image
            </Button>         

            <Button size="small" variant="contained" 
                onClick={createReview} sx={{ m: 1 }}
            >
                Add a review
            </Button>   
        </Box>
             
    </Box>
    )
}