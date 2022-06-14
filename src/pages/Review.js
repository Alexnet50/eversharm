import React, { useState, useContext } from 'react';
import { doc, updateDoc } from "firebase/firestore";
import {db, storage} from "../firebase-config";
import { ref, deleteObject } from "firebase/storage";
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Typography, Card, Collapse, IconButton, 
     CardContent, CardActions } from "@mui/material";
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
                                        <img src={url} key={key} alt={"Review"}/>
                                    )                                            
                                })
                            }
                    </Slider>
                </Box>,
            openModal: true 
        }));        
    };    
    
    const deleteHandler = async () => {        
        const hotelDoc = doc(db, "hotels", user.currentHotel);
        let imageList = props.hotel.imageList;
        let reviewsList = props.hotel.reviewsList;
        const index = reviewsList.findIndex(item => item.reviewId === props.review.reviewId);
        reviewsList.splice(index, 1);            
        
        const deleteImages = async (url) => {
            try {
                const imageRef = ref(storage, url);          
                deleteObject(imageRef);  

                
                const index = imageList.findIndex(item => item === url);
                imageList.splice(index, 1);                                 
            }        
            catch(error) {
                console.log("Deleting error!");
            }
        }; 
        
        props.review.myImageList.map((url) => deleteImages(url));
        const newRating = Math.floor(((props.hotel.rating * props.hotel.reviewsList.length - props.review.overall) / (props.hotel.reviewsList.length - 1)) * 10) / 10;      
        
        await updateDoc(hotelDoc, { 
            reviewsList: reviewsList,
            imageList: imageList,
            rating: newRating
        });
        props.callback();       
    };

    key++;

    return (
        <>
            <Card key={key} sx={{ maxWidth: 500, mb: 2 }}>
                <CardContent>
                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', pl: 2 }}>
                        <ColoredNumber number={props.review.overall} size={"h4"} />

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                            <Typography variant='subtitle1' color="text.secondary" fontWeight="bold" 
                                sx={{ fontFamily:'helvetica' }}>
                                    {props.review.reviewAuthor}
                            </Typography>   

                            <Typography variant='subtitle2' color="text.secondary" fontWeight="bold" 
                                sx={{ fontFamily:'helvetica' }}>
                                    {props.review?.date}
                            </Typography>  

                        </Box>
                                                   
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
                                        <img src={url} key={key} style={{ margin: 2, height: 150 }}
                                            onClick={() => imageClickHandler()} alt={"Review"}
                                        />
                                    )                                            
                                })
                            }
                        </Box>
                        {user.currentUser && props.review.reviewAuthor === user.currentUser.email  
                            && <Button 
                                onClick={() => deleteHandler()}
                            >
                                Delete review
                            </Button>}                            
                </CardContent>
            </Collapse>
            </Card>           
        </>
  );
}
