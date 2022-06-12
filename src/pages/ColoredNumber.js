import React, { useState, useEffect } from 'react';
import { Box, Typography } from "@mui/material";
import { green } from '@mui/material/colors';
import { yellow } from '@mui/material/colors';
import { orange } from '@mui/material/colors';

export default function ColoredNumber(props) {
    const [color, setColor] = useState("rgba(0, 230, 0, 1)");

    const getColor = () => {        
        if (props.number <= 2) setColor("error")
        else if (props.number > 2 && props.number <= 3) setColor("orange")
        else if (props.number > 3 && props.number < 4) setColor("yellow");
    }    
    
    useEffect(() => {
        getColor();        
    }, [color]);
    return (        
        <Box>
            <Typography variant={props.size} color={color} fontFamily="Poppins" >{props.number}</Typography>
        </Box>            
    )
};