import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {collection, getDocs, where, query, orderBy, limit} from "firebase/firestore";
import {db} from "../firebase-config";
import { UserContext } from '../App';
import { Box, Button, Typography, Grid, Card, Checkbox,
     CardMedia, CardActionArea,
    FormControl, InputLabel, Select, MenuItem, FormControlLabel
    } from "@mui/material";
import Stars from './Stars';
import ColoredNumber from './ColoredNumber';
import Icons from './Icons';
     
let key = 0;

export default function HotelsList() {
    const {user, setUser} = useContext(UserContext);
    const [hotels, setHotels] = useState([]);   
    const [sort, setSort] = useState({
        value: 'rating', 
        order: 'desc', 
        name: 'rating', 
        three: 3, 
        four: 4, 
        five: 5
    });
    const hotelsRef = collection(db, 'hotels');  

    const navigate = useNavigate();
    
    const getHotels = async() => {        
        const data = query(hotelsRef, orderBy(sort.name, sort.order), where('stars', 'in', [sort.three, sort.four, sort.five]) , limit(20));      
        const querySnapshot = await getDocs(data);
        let hotelsArray = [];
        querySnapshot.forEach((doc) => hotelsArray.push({...doc.data(), id: doc.id}))       
        setHotels(hotelsArray);        
    };
    

    const sortHandler = (event) => {        
        event.target.value === 'name' ?
        setSort((prev) => ({...prev, value: 'name', order: 'asc', name: 'hotelName'})) :
        setSort((prev) => ({...prev, value: 'rating', order: 'desc', name: 'rating'}));
        
    };

    const toggleCheckbox = (digit) => {
        switch (digit) {
            case 5: 
            sort.five === 5 ? setSort((prev) => ({...prev, five: 0})) : setSort((prev) => ({...prev, five: 5}));
            break;
            case 4: 
            sort.four === 4 ? setSort((prev) => ({...prev, four: 0})) : setSort((prev) => ({...prev, four: 4}));
            break;
            case 3: 
            sort.three === 3 ? setSort((prev) => ({...prev, three: 0})) : setSort((prev) => ({...prev, three: 3}));
        }        
    }

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
                    value={sort.value}
                    label="Sorting order"
                    onChange={sortHandler}
                >                    
                    <MenuItem value={"name"} >name</MenuItem>
                    <MenuItem value={"rating"} >rating</MenuItem>                        
                </Select>
            </FormControl>
            

            <Box sx={{ display: "flex", flexDirection: "row", m: 1 }}>
                    <FormControlLabel control={
                        <Checkbox 
                            checked={sort.five === 5}
                            size='small'
                            onChange={(event) => toggleCheckbox(5)}
                        />} 
                        label="5 stars" 
                    />
                    <FormControlLabel control={
                        <Checkbox
                            checked={sort.four === 4}
                            size='small'
                            onChange={(event) => toggleCheckbox(4)}
                        />} 
                        label="4 stars" 
                    />
                    <FormControlLabel control={
                        <Checkbox 
                            checked={sort.three === 3}
                            size='small'
                            onChange={(event) => toggleCheckbox(3)}
                        />} 
                        label="3 stars" />
            </Box>

            <Grid container spacing={2} sx={{ mt: 1, ml: "auto", mr: "auto" }}>
                {hotels.map(hotel => {
                    key++;                            
                    return (
                        <Grid item key={key}>
                            <Card sx={{ width: 345 }}>
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
                        </Grid>                                                       
                    )
                })}
            </Grid>
        </>                              
    )                
}
