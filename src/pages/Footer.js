import React from "react";
import { Container, Typography } from '@mui/material';

export default function Footer() {
    return (
        <Container maxWidth="lg" sx={{ height: '60px', mt: 3,
            display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'  }}
            style={{ backgroundColor: 'rgba(0, 174, 255, 1)'}}
        >
            <Typography variant="subtitle1" sx={{ m: 'auto', color: 'rgba(255, 255, 255, 1)' }}>
                Alex-Code  All rights reserved &#169; 2022
            </Typography>
        </Container>
    )
    
}