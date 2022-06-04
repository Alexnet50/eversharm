import React, { useState, useContext, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Button, Typography, Grid, Card, Collapse, IconButton, 
    CardMedia, CardContent, CardActions } from "@mui/material";
import ColoredNumber from './ColoredNumber';
import NewModal from './Modal'
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
    const [openModal, setOpenModal] = useState(false);
    const [modalContent, setModalContent] = useState()
    const handleOpen = () => setOpenModal(true);
    const handleClose = () => setOpenModal(false);
    
    const [slideIndex, setSlideIndex] = useState();

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const imageClickHandler = (index) => {        
        setSlideIndex(index)             
        setModalContent(        
            <Box 
            sx={{ height: 200, width: 800 }}
            >
                <Slider 
                // adaptiveHeight={true} 
                // ref={ slider => (slider.slickGoTo(slideIndex)) }
                    >
                    {props.review.myImageList && 
                            props.review.myImageList.map((url) => {
                                key++;
                                return (
                                    <img src={url} key={key} style={{ m: 1 }} />
                                )                                            
                            })
                        }
                </Slider>
            </Box> 
        )

        setOpenModal(true)
         
    }

    

    return (
      <>
    {/* <Paper key={key} sx={{ m: 1, p: 2 }}>
    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', pl: 2 }}>
        <ColoredNumber number={review.overall} size={"h4"} />

        <Typography variant='subtitle1' color="text.secondary" fontWeight="bold" 
            sx={{ fontFamily:'helvetica' }}>
                {review.reviewAuthor}
        </Typography>                              
    </Box>
                                    
    <Typography variant='h6'>{review.reviewTitle}</Typography>
    <Typography variant='body1' sx={{ m: 1 }}>{review.reviewText}</Typography>
    <Box>
        {review.myImageList && 
            review.myImageList.map((url) => {
                key++;
                return (
                    <img src={url} key={key} style={{ m: 1, height: 150 }} />
                )                                            
            })
        }
    </Box>
    {user.userName && review.reviewAuthor === user.userName  
        && <Button 
        // onClick={() => deleteHandler(review.id)}
        >
            Delete review
        </Button>}
</Paper>                    */}




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
                            <img src={url} key={url.index} style={{ m: 1, height: 150 }}
                            onClick={() => imageClickHandler(2)}
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

    <NewModal openModal={openModal} content={modalContent} handleClose={handleClose} />
    </>
  );
}
