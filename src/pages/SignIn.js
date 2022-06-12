import { useState, useContext } from "react";
import { auth } from "../firebase-config";
import { UserContext } from '../App';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Button, TextField, Typography } from "@mui/material";
import { Box } from '@mui/material';


export function SignIn(props) {
    const {user, setUser} = useContext(UserContext);
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');    
    const [confirmPassword, setConfirmPassword] = useState('');    

    let errorCode;
    let errorMessage;

    // const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/  
    
    const register = async () => {
        if (registerPassword === confirmPassword) {
        try {
            const userCreate = await createUserWithEmailAndPassword(
                auth, registerEmail, registerPassword
            );            
                  
            props.callback(false);                    
        } 
        catch (error){
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
        }} 
        else setUser((prev) => ({ ...prev, 
            modalContent: <Typography sx={{ m: 2 }} variant='h5' >Passwords are not match!</Typography>,
            openModal: true 
        })) 
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
                Sign In
            </Typography>
            <TextField placeholder="Enter an email" 
                size="small" value={registerEmail}  sx={{ mb: 2 }}
                onChange={(event) => setRegisterEmail(event.target.value)}
                required
            />
            <TextField placeholder="Enter a password" 
                size="small" value={registerPassword} sx={{ mb: 2 }} type="password"
                onChange={(event) => setRegisterPassword(event.target.value)}
                required
            />

            <TextField placeholder="Confirm a password" 
                size="small" value={confirmPassword} sx={{ mb: 2 }} type="password"
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
            />

            <Button variant="outlined" onClick={register}>Create a user</Button>                    
        </Box>
    );
};


