import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { UserContext } from '../App';
import { Box, Button, TextField, Typography } from "@mui/material";


//ADMIN

//LOGIN: aladdin@ukr.net
//PASSWORD: login123

export function LogIn(props) {   
    const [logInEmail, setLogInEmail] = useState('');
    const [logInPassword, setLogInPassword] = useState('')
    const {user, setUser} = useContext(UserContext);   

    let errorCode;
    let errorMessage;
    const navigate = useNavigate();

    // const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

    const logIn = async () => {
       
        try {
            const userSignIn = await signInWithEmailAndPassword(
                auth, logInEmail, logInPassword
            );
            // userSignIn();
            setUser((prev) => ({ ...prev, userName: logInEmail }));
           
            if (logInEmail === "aladdin@ukr.net") setUser((prev) => ({ ...prev, isAdmin: true }));            
            // console.log(setUser) 
            props.callback(false);           
            navigate("/");
        } 
        catch (error){
            errorCode = error.code;
            errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        }
    };
   
    return (        
        <Box sx={{ m: 2, display: 'flex', flexDirection: 'column'}}>          
            <Typography 
                variant="h6" 
                sx={{ 
                    mb: 2,                                                                            
                    color: 'secondary'                            
                }}
            >
                Log In
            </Typography>
            <TextField placeholder="Enter an email" 
                size="small" value={logInEmail} sx={{ mb: 2 }}
                onChange={event => setLogInEmail(event.target.value)}
            />
            <TextField placeholder="Enter a password" 
                size="small" value={logInPassword} sx={{ mb: 2 }}
                onChange={event => setLogInPassword(event.target.value)}
            />
            
            <Button variant="outlined" onClick={logIn}>Log in</Button>            
        </Box>
    );
}


