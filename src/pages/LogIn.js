import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { UserContext } from '../App';
import { Box, Button, TextField, Typography } from "@mui/material";


//ADMIN

//LOGIN: aladdin@ukr.net
//PASSWORD: login123

function LogIn() {   
    const [logInEmail, setLogInEmail] = useState('');
    const [logInPassword, setLogInPassword] = useState('')
    const {user, setUser} = useContext(UserContext);
    // const [isAdmin, setIsAdmin] = useContext(UserContext.isAdminValue);

    let errorCode;
    let errorMessage;
    const navigate = useNavigate();

    // const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

    
    

    // onAuthStateChanged(auth, (currentUser) => {
    //     if (currentUser) localStorage.setItem("email", currentUser.email);          
    // });
    // console.log(setUser)
    // console.log(setIsAdmin)
    const logIn = async () => {
       
        try {
            const userSignIn = await signInWithEmailAndPassword(
                auth, logInEmail, logInPassword
            );
            // userSignIn();
            setUser((prev) => ({ ...prev, userName: logInEmail }));
           
            if (logInEmail === "aladdin@ukr.net") setUser((prev) => ({ ...prev, isAdmin: true }));            
            // console.log(setUser)            
            navigate("/");
        } 
        catch (error){
            errorCode = error.code;
            errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        }
    };

    // const logOut = async () => {
    //     await signOut(auth);
    //     localStorage.removeItem("email");
    //     window.location.reload();
    // };

    // useEffect(()=>{
    //     console.log(user.userName)
    // }, [user])
    
    return (        
        <Box className="logIn">          
            <Typography variant="h6">Log In</Typography>
            <TextField placeholder="Enter an email" size="small" value={logInEmail}
                onChange={event => setLogInEmail(event.target.value)}/>
            <TextField placeholder="Enter a password" size="small" value={logInPassword}
                onChange={event => setLogInPassword(event.target.value)}/>
            
            <Button variant="outlined" onClick={logIn}>Log in</Button>            
        </Box>
    );
}

export default LogIn;
