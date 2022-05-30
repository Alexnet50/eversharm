import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {collection, getDocs, deleteDoc, doc} from "firebase/firestore";
import {db} from "../firebase-config";
import { UserContext } from '../App';
import { Box, Button, Typography, Grid, Card,
     CardMedia, CardContent, CardActions } from "@mui/material";
     
let key = 0;

export default function HotelsList() {
    const {user, setUser} = useContext(UserContext);
    const [hotels, setHotels] = useState([]);
    const hotelsRef = collection(db, 'hotels');  

    const navigate = useNavigate();
    
    const getHotels = async() => {        
        const data = await getDocs(hotelsRef);
        setHotels(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    };

    const infoHandler = (id) => {         
        setUser((prev) => ({ ...prev, currentHotel: id }))        
        navigate("/hotel")       
    };    

    const reviewHandler = (id) => {         
        setUser((prev) => ({ ...prev, currentHotel: id }))        
        navigate("/createreview")       
    };    

    const editHandler = (id) => {         
        setUser((prev) => ({ ...prev, currentHotel: id }))        
        navigate("/createhotel")       
    };    

    useEffect(() => {        
        getHotels();        
    }, []); 

    
    return (                                          
        <Grid container spacing={2} sx={{ mt: 1, ml: "auto", mr: "auto" }}>
            {hotels.map(hotel => {
                key++;                            
                return (
                    <Grid item key={key}>
                        <Card sx={{ maxWidth: 345 }}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={hotel.imageList && hotel.imageList[0]}
                                alt={hotel.hotelName}
                        />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    {hotel.hotelName}
                                </Typography>
                                <Typography gutterBottom variant="subtitle2" component="div">
                                    Stars: {hotel.stars}<br/>
                                    Line from the shore: {hotel.line}<br/>
                                    Heated swimming pool: {hotel.warmPool && "Yes"}<br/>
                                    Aquapark or water slades: {hotel.aquapark && "Yes"}<br/>
                                    Kids club: {hotel.kidsClub && "Yes"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {hotel.hotelDescription}
                                </Typography>
                            </CardContent>
                            <CardActions>                                                                
                                <Button 
                                    size="small" sx={{ mr: 1}}
                                    onClick={() => infoHandler(hotel.id)}
                                >
                                    More Info
                                </Button>
                                
                                {user.userName && !user.isAdmin &&                               
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
    )                
}
