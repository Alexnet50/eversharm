import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import {auth, db} from "../firebase-config";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { Button, TextField, Typography } from "@mui/material";


function LogIn({ setIsAuth }) {   
    const [logInEmail, setLogInEmail] = useState('');
    const [logInPassword, setLogInPassword] = useState('')

    let errorCode;
    let errorMessage;


    const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

    let navigate = useNavigate();
    

    // onAuthStateChanged(auth, (currentUser) => {
    //     if (currentUser) localStorage.setItem("email", currentUser.email);          
    // });

    const logIn = async () => {
        try {
            const user = await signInWithEmailAndPassword(
                auth, logInEmail, logInPassword
            );
            // localStorage.setItem("isAuth", true);
            setIsAuth(true);
            setLogInEmail("");
            setLogInPassword("");
            // console.log(user);
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

    
    return (        
        <div className="logIn">            
            
            <div>
                <Typography>Log In</Typography>
                <TextField placeholder="Enter an email" size="small" value={logInEmail}
                    onChange={event => setLogInEmail(event.target.value)}/>
                <TextField placeholder="Enter a password" size="small" value={logInPassword}
                    onChange={event => setLogInPassword(event.target.value)}/>
                
                <Button variant="outlined" onClick={logIn}>Log in</Button>
            </div>
            
            {/* <div>
                <h3>User logged in: {localStorage.getItem("email")}</h3>
                
            </div>                  */}
        </div>
    );
}

export default LogIn;
