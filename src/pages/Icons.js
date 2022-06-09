import React, { useState, useContext } from 'react';
import { Popover, Typography, Box } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';


export default function Icons(props) {    
    const [coef] = useState(props.coef);

    const LightTooltip = styled(({ className, ...props }) => (
            <Tooltip {...props} classes={{ popper: className }} />
        ))(({ theme }) => ({
            [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: 'rgba(0, 149, 239, 1)',
            color: 'rgba(255, 255, 255, 1)',
            boxShadow: theme.shadows[1],
            fontSize: 14,
            },
        }));

    const NewIcon = (props) => {
        return (
            <LightTooltip title={props.prompt}>           
                <Box                    
                    style={{ marginRight: 15, width: `${32 * coef}px`, height: `${32 * coef}px`, 
                    backgroundImage: `url(/images/${props.url})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
                ></Box>
            </LightTooltip>            
        )
    }    

    

    return (    
        <Box sx={{ m: 1, display: 'flex', flexDirection: 'row'}}>
            {/*  */}
            {props.hotel?.line === 1 && <NewIcon url={'1line.png'} prompt={'1st line from the seashore'} />}                                          
            
            {props.hotel?.line === 2 && <NewIcon url={'2line.png'} prompt={'2nd line from the seashore'} />}                                          
                
            {props.hotel?.warmPool && <NewIcon url={'swimming-pool1.png'} prompt={'Heated swimming pool'} />}                
            
            {props.hotel?.aquapark && <NewIcon url={'slide.png'} prompt={'Aquapark or water slades'} />}                
            
            {props.hotel?.kidsClub && <NewIcon url={'playground.png'} prompt={'Kids club'} />}                
            
            {props.hotel?.coralReef && <NewIcon url={'reef.png'} prompt={'Coral reef'} />}
                
            {props.hotel?.sandBeach && <NewIcon url={'bucket.png'} prompt={'Sand beach'} />}
                
            {props.hotel?.freeWiFi && <NewIcon url={'free-wifi.png'} prompt={'Free WiFi'} />}
            
        </Box>      
    );
}