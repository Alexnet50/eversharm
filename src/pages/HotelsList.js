import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {collection, getDocs, deleteDoc, doc, query, orderBy, limit} from "firebase/firestore";
import {db} from "../firebase-config";
import { UserContext } from '../App';
import { Box, Button, Typography, Grid, Card,
     CardMedia, CardContent, CardActions, CardActionArea,
    FormControl, InputLabel, Select, MenuItem
    } from "@mui/material";
import Stars from './Stars';
import ColoredNumber from './ColoredNumber';
     
let key = 0;

export default function HotelsList() {
    const {user, setUser} = useContext(UserContext);
    const [hotels, setHotels] = useState([]);
    const [sort, setSort] = useState("rating");
    const hotelsRef = collection(db, 'hotels');  

    const navigate = useNavigate();
    
    const getHotels = async() => {        
        // const data = await getDocs(hotelsRef);
        const data = query(hotelsRef, orderBy(sort, "desc"), limit(20));        
        const querySnapshot = await getDocs(data);
        let hotelsArray = [];
        querySnapshot.forEach((doc) => hotelsArray.push({...doc.data(), id: doc.id}))       
        setHotels(hotelsArray);        
    };

    const sortHandler = (event) => {
        setSort(event.target.value);
        // getHotels();
    };

    const infoHandler = (id) => {         
        setUser((prev) => ({ ...prev, currentHotel: id }));        
        navigate("/hotel");       
    };    

    const reviewHandler = (id) => {         
        setUser((prev) => ({ ...prev, currentHotel: id }));        
        navigate("/createreview");       
    };    

    const editHandler = (id) => {         
        setUser((prev) => ({ ...prev, currentHotel: id }));        
        navigate("/createhotel");       
    };    

    useEffect(() => {        
        getHotels();        
    }, [sort]); 

    
    return (  
        <>   
            <FormControl sx={{ m: 1 }} size="small">
                <InputLabel>Sort by</InputLabel>
                <Select                    
                    id="sort"
                    sx={{ width: 200 }}                    
                    value={sort}
                    label="Sorting order"
                    onChange={
                        sortHandler
                        // event => setSort(event.target.value)
                    }
                >                    
                    <MenuItem value={"hotelName"}>name</MenuItem>
                    <MenuItem value={"rating"}>rating</MenuItem>                        
                </Select>
            </FormControl>
            <Grid container spacing={2} sx={{ mt: 1, ml: "auto", mr: "auto" }}>
                {hotels.map(hotel => {
                    key++;                            
                    return (
                        <Grid item key={key}>
                            <Card sx={{ maxWidth: 345 }}>
                                <CardActionArea onClick={() => infoHandler(hotel.id)}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={hotel.imageList && hotel.imageList[0]}
                                        alt={hotel.hotelName}
                                    />
                                    <CardContent>
                                        <Box sx={{ m: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Stars stars={hotel.stars} />
                                            </Box>
                                            
                                            {hotel.rating !== 0 && <ColoredNumber number={hotel.rating} size={"h5"} />}
                                        </Box>
                                        
                                        <Typography gutterBottom variant="h5" component="div">
                                            {hotel.hotelName}
                                        </Typography>
                                        <Typography gutterBottom variant="subtitle2" component="div">                                    
                                            Line from the shore: {hotel.line}</Typography>
                                        {hotel.warmPool && <Typography gutterBottom variant="subtitle2">Heated swimming pool</Typography>}
                                        {hotel.aquapark && <Typography gutterBottom variant="subtitle2">Aquapark or water slades</Typography>}
                                        {hotel.kidsClub && <Typography gutterBottom variant="subtitle2">Kids club</Typography>}
                                        
                                        <Typography variant="body2" color="text.secondary">
                                            {hotel.hotelSummary ? hotel.hotelSummary : hotel.hotelDescription}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>

                                <CardActions>                                                                
                                    <Button 
                                        size="small" sx={{ mr: 1}}
                                        onClick={() => infoHandler(hotel.id)}
                                    >
                                        More Info
                                    </Button>
                                    
                                    {user.currentUser && !user.isAdmin &&                               
                                        <Button 
                                            size="small" sx={{ mr: 1}}
                                            onClick={() => reviewHandler(hotel.id)}
                                        >
                                            Add A Review
                                        </Button>                                   
                                    }  

                                    {user.isAdmin &&                              
                                        <Button 
                                            size="small"
                                            sx={{ mr: 1}}
                                            onClick={() => editHandler(hotel.id)}
                                        >
                                            Edit Hotel
                                        </Button>                                    
                                    }                                                 
                                </CardActions>
                            </Card>
                        </Grid>                                                       
                    )
                })}
            </Grid>
        </>                              
    )                
}
