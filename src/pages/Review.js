import React, { useState, useContext, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Typography, Grid, Card, Collapse, IconButton, 
    CardMedia, CardContent, CardActions } from "@mui/material";
import ColoredNumber from './ColoredNumber';
import { UserContext } from '../App';
import Slider from 'react-slick';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

let key = 0;
export default function Review(props) {
    const [expanded, setExpanded] = useState(false);
    const {user, setUser} = useContext(UserContext);    

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const imageClickHandler = () => {  
        setUser((prev) => ({ ...prev, 
            modalContent: 
                <Box sx={{ height: 600, width: 800 }}>
                    <Slider>
                        {props.review.myImageList && 
                                props.review.myImageList.map((url) => {
                                    key++;
                                    return (
                                        <img src={url} key={key} />
                                    )                                            
                                })
                            }
                    </Slider>
                </Box>,
            openModal: true 
        }));        
    }

    

    return (
        <>
            <Card key={props.key} sx={{ maxWidth: 500, m: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', pl: 2 }}>
                    <ColoredNumber number={props.review.overall} size={"h4"} />

                    <Typography variant='subtitle1' color="text.secondary" fontWeight="bold" 
                        sx={{ fontFamily:'helvetica' }}>
                            {props.review.reviewAuthor}
                    </Typography>                              
                    </Box>
                
                    <Typography variant='h6'>{props.review.reviewTitle}</Typography>
                    {expanded === false &&
                        props.review.reviewText.length > 220 &&                 
                            <Typography variant='body1' sx={{ m: 1 }}>{props.review.reviewText.slice(0, 200) + '...'}</Typography>                    
                    }
                    {expanded === false &&   
                        props.review.reviewText.length <= 220 &&                 
                            <Typography variant='body1' sx={{ m: 1 }}>{props.review.reviewText}</Typography>                    
                        
                    }
                    
                </CardContent>
                <CardActions disableSpacing>        
                    <ExpandMore
                    expand={expanded}
                    onClick={handleExpandClick}
                    aria-expanded={expanded}
                    aria-label="show more"
                    >
                    <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>

                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Typography variant='body1' sx={{ m: 1 }}>{props.review.reviewText}</Typography>
                        <Box>
                            {props.review.myImageList && 
                                props.review.myImageList.map((url) => {
                                    key++;
                                    return (
                                        <img src={url} key={url.index} style={{ margin: 2, height: 150 }}
                                            onClick={() => imageClickHandler()}
                                        />
                                    )                                            
                                })
                            }
                        </Box>
                        {user.userName && props.review.reviewAuthor === user.userName  
                            && <Button 
                                // onClick={() => deleteHandler(props.review.id)}
                            >
                                Delete review
                            </Button>}                            
                </CardContent>
            </Collapse>
            </Card>           
        </>
  );
}
