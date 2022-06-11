import React from 'react';
import StarIcon from '@mui/icons-material/Star';

export default function Stars(props) {    
    let starsRow = [];
    for (let i = 0; i < props.stars; i++) {
        starsRow.push(<StarIcon key={i} color="warning" />)
    }    
    return (starsRow);
};