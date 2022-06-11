import React, { useContext, useEffect } from 'react';

import { UserContext } from '../App';
import { Box } from "@mui/material";
import HotelsList from './HotelsList';

export default function Home() {
    const { setUser } = useContext(UserContext);        

    useEffect(() => {         
        setUser((prev) => ({...prev, currentHotel: null}));        
    }, []);
    
    return (
        <Box> 
            <HotelsList />            
        </Box>    
    )
}