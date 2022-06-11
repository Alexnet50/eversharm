import { useState, useContext } from "react";
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { UserContext } from '../App';
import { Box, Button, TextField, Typography } from "@mui/material";


//ADMIN

//LOGIN: aladdin@ukr.net
//PASSWORD: login123

export function LogIn(props) {   
    const [logInEmail, setLogInEmail] = useState('');
    const [logInPassword, setLogInPassword] = useState('')
    const { setUser } = useContext(UserContext);   

    let errorCode;
    let errorMessage;
    

    // const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

    const logIn = async () => {        
        try {
            signInWithEmailAndPassword(
                auth, logInEmail, logInPassword
            );                
            props.callback(false);        
        }
        catch (error) {
            errorCode = error.code;
            errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
            setUser((prev) => ({ ...prev, 
                modalContent: 
                <>
                    <Typography sx={{ m: 2 }} variant='h5' >{error.message}</Typography>
                    <Button onClick={closeModal} sx={{ ml: '80%'}} >OK</Button>
                </>
                ,
                openModal: true 
            })) 
        }
    };

    const resetHandler = async () => {
        try {
            await sendPasswordResetEmail(auth, logInEmail);
            setUser((prev) => ({ ...prev, 
                modalContent: 
                <>
                    <Typography sx={{ m: 2 }} variant='h5' >Password reset link sent!</Typography>
                    <Button onClick={closeModal} sx={{ ml: '80%'}} >OK</Button>
                </>
                ,
                openModal: true 
            }))             
            } catch (error) {
                setUser((prev) => ({ ...prev, 
                    modalContent: 
                    <>
                        <Typography sx={{ m: 2 }} variant='h5' >{error.message}</Typography>
                        <Button onClick={closeModal} sx={{ ml: '80%'}} >OK</Button>
                    </>
                    ,
                    openModal: true 
                }))     
                console.error(error);
                alert(error.message);
            }
    };


    const closeModal = () => {setUser((prev) => ({ ...prev, openModal: false}))};

   
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
                size="small" value={logInPassword} sx={{ mb: 2 }} type="password"
                onChange={event => setLogInPassword(event.target.value)}
            />
            
            <Button variant="outlined" sx={{ mb: 2 }} 
            onClick={logIn}>Log in</Button>  

            <Button onClick={resetHandler}>I forgot my password</Button>          
        </Box>
    );
}


