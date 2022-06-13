import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {collection, getDocs, where, query, orderBy, limit} from "firebase/firestore";
import {db} from "../firebase-config";
import { UserContext } from '../App';
import { Box, Button, Typography, Grid, Card,
     CardMedia, CardActionArea    
    } from "@mui/material";
import Stars from './Stars';
import ColoredNumber from './ColoredNumber';
import Icons from './Icons';
import ScrollAnimation from 'react-animate-on-scroll';
import "animate.css/animate.min.css";
     
let key = 0;

export default function HotelsList(props) {
    const {user, setUser} = useContext(UserContext);
    const [hotels, setHotels] = useState([]);   
    
    const hotelsRef = collection(db, 'hotels');  

    const navigate = useNavigate();
    
    const getHotels = async() => {        
        const data = query(hotelsRef, orderBy(props.sort.name, props.sort.order), where('stars', 'in', [props.sort.three, props.sort.four, props.sort.five]) , limit(20));      
        const querySnapshot = await getDocs(data);
        let hotelsArray = [];
        querySnapshot.forEach((doc) => hotelsArray.push({...doc.data(), id: doc.id}))       
        setHotels(hotelsArray);        
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
        console.log(user.currentUser)      
    }, [props.sort]); 

    
    return (  
        <> 
            <Grid container spacing={2} sx={{ mt: 1, ml: "auto", mr: "auto" }}>
                {hotels.map(hotel => {
                    key++;                            
                    return (
                        
                        <Grid item key={key}>
                            <ScrollAnimation 
                                animateIn="animate__bounceInLeft" 
                                animateOnce                            
                            >
                            <Card                             
                            sx={{ width: 345 }}                            
                            >
                                <CardActionArea onClick={() => infoHandler(hotel.id)}>
                                    <CardMedia
                                        component="img"
                                        height="150"
                                        image={hotel.imageList && hotel.imageList[0]}
                                        alt={hotel.hotelName}
                                    />
                                    <Box sx={{ p: 1 }} style={{ backgroundColor: 'rgba(0, 150, 255, 0.08)' }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Box>
                                                <Stars stars={hotel.stars} />
                                            </Box>
                                            
                                            {hotel.rating !== 0 && <ColoredNumber number={hotel.rating} size={"h5"} />}
                                        </Box>                                        
                                        
                                        <Typography gutterBottom variant="h5" component="div">
                                            {hotel.hotelName}
                                        </Typography>

                                        <Icons hotel={hotel} coef={1} />
                                        
                                    </Box>
                                </CardActionArea>
                                
                                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'end' }} 
                                    style={{ backgroundColor: 'rgba(0, 150, 255, 0.08)' }} >                                 
                                    {user.currentUser && !user.isAdmin &&                               
                                        <Button 
                                            size="small" sx={{ mr: 2}}
                                            onClick={() => reviewHandler(hotel.id)}
                                        >
                                            Add A Review
                                        </Button>                                   
                                    }  

                                    {user.isAdmin &&                              
                                        <Button 
                                            size="small"
                                            sx={{ mr: 2}}
                                            onClick={() => editHandler(hotel.id)}
                                        >
                                            Edit Hotel
                                        </Button>                                    
                                    }

                                    <Button 
                                        size="small" sx={{ mr: 1}}
                                        onClick={() => infoHandler(hotel.id)}
                                    >
                                        More Info
                                    </Button> 
                                </Box>                       
                            </Card>
                            </ScrollAnimation> 
                        </Grid>
                                                                              
                    )
                })}
            </Grid>
        </>                              
    )                
}
