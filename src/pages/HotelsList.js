import React, { useState, useContext, useEffect } from 'react';
import {  Link, useNavigate } from "react-router-dom";
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
    const linkStyle = {        
        textDecoration: "none",        
    };

    const getHotels = async() => {
        // setHotels([]);
        const data = await getDocs(hotelsRef);
        setHotels(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    };

    const editHandler = (id) => {
        console.log(id) 
        setUser((prev) => ({ ...prev, editableHotel: id }))        
        navigate("/createhotel")       
    };    

    useEffect(() => {        
        getHotels();        
    }, []); 

    
    return (                              
        <Grid container spacing={2} sx={{ mt: 1}}>
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
                                {user.userName &&                                                
                                    <Link to={"/createreview"} style={linkStyle}><Button size="small" sx={{ mr: 1}}>Add A Review</Button></Link>
                                }  

                                <Link to={"/hotel"} style={linkStyle}><Button size="small" sx={{ mr: 1}}>More Info</Button></Link>
                                
                                {user.isAdmin &&                                                
                                    // <Link to={"/createhotel"} style={linkStyle}>
                                        <Button 
                                            size="small"
                                            sx={{ mr: 1}}
                                            onClick={() => editHandler(hotel.id)}
                                        >
                                            Edit Hotel
                                        </Button>
                                    // </Link>
                                }                                                 
                            </CardActions>
                        </Card>
                    </Grid>                                                       
                )
            })}
        </Grid>                        
    )                
}
