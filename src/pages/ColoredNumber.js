import React, { useState, useEffect } from 'react';
import { Box, Typography } from "@mui/material";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { lime } from '@mui/material/colors';
import { yellow } from '@mui/material/colors';
import { orange } from '@mui/material/colors';

export default function ColoredNumber(props) {
    const [color, setColor] = useState("lime");

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
            <Typography variant={props.size} color={color} fontWeight="700" >{props.number}</Typography>
        </Box>            
    )
};