import React, { useState } from 'react';
import { Box, Typography } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';

export default function Stars(props) {
    // const [starsRow, setStarsRow] = useState("");
    let starsRow = [];
    for (let i = 0; i < props.stars; i++) {
        starsRow.push(<StarIcon key={i} color="warning" />)
    }
    
    return (starsRow);
};