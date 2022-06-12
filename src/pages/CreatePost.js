import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import {collection, addDoc } from "firebase/firestore";

import { db } from "../firebase-config";
// import { UserContext } from '../App';
import { Box, Typography, Button      
    } from '@mui/material';
import { Editor } from '@tinymce/tinymce-react';

 let key = 0;

 export default function CreateHotel() {
    // const {user, setUser} = useContext(UserContext);
    const [post, setPost] = useState("");

    const navigate = useNavigate();
    const editorRef = useRef(null);
    const postsCollectionRef = collection(db, "posts");
    
    const editorHandler = () => {
        if (editorRef.current) {
        setPost(editorRef.current.getContent());
        }
    };
    

    const createHandler = async () => {        
        await addDoc(postsCollectionRef, {content: post});
        navigate("/"); 
    };

    const cancelHandler = () => {        
        navigate("/"); 
    };
    
    return (
        <Box>
            <Typography
                variant="h5"
                sx={{
                    ml: 2,
                    mt: 2,
                    color: "text.secondary",
                    fontWeight: 700
                }}
            >
                Create a post
            </Typography>

            <Editor
                apiKey='xnkep1e83iv4c4o42kq6tu0te8ail8r5o8x5zgqmtoue25xl'
                onInit={(evt, editor) => editorRef.current = editor}
                onChange={editorHandler}
                initialValue={post}
                init={{
                height: 800,
                menubar: false,
                plugins: [
                    
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                content_style: 'body { font-family:Helvetica,Arial,Roboto,sans-serif; font-size:14px }'
                }}
            /> 

            <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
                <Button variant="contained"
                    sx={{
                        m: 1,
                        width: 200
                    }}
                    onClick={createHandler}>
                        Save a post
                </Button> 

                <Button variant="outlined" 
                    sx={{
                        m: 1,
                        width: 200
                    }}
                    onClick={cancelHandler}>
                        Cancel
                </Button>
            </Box>

        </Box>
    )
}