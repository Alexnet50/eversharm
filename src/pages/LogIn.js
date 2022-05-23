import { useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import {auth, db} from "../firebase-config";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { UserContext } from '../App';
import { Button, TextField, Typography } from "@mui/material";


function LogIn() {   
    const [logInEmail, setLogInEmail] = useState('');
    const [logInPassword, setLogInPassword] = useState('')
    const {user, setUser, isAdmin, setIsAdmin} = useContext(UserContext);
    // const [isAdmin, setIsAdmin] = useContext(UserContext.isAdminValue);

    let errorCode;
    let errorMessage;


    const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

    let navigate = useNavigate();
    

    // onAuthStateChanged(auth, (currentUser) => {
    //     if (currentUser) localStorage.setItem("email", currentUser.email);          
    // });
    console.log(setUser)
    console.log(setIsAdmin)
    const logIn = async () => {
        try {
            const user = await signInWithEmailAndPassword(
                auth, logInEmail, logInPassword
            );
            // localStorage.setItem("isAuth", true);
            setUser(logInEmail);
            if (logInEmail === "aladdin@ukr.net") setIsAdmin(true);
            setLogInEmail("");
            setLogInPassword("");
            
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
