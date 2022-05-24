import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import {TextField, Box, FormGroup, Button, Container} from '@mui/material';
import { auth } from "../firebase-config";
import { UserContext } from '../App';
// import Home from "./pages/Home";
// import LogIn from "./pages/LogIn";
// import CreatePost from "./pages/CreatePost";

// import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Button, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";



function SignIn() {
    const {user, setUser} = useContext(UserContext);
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    

    let errorCode;
    let errorMessage;


    // const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

    // const usersRef = collection(db, 'users');
    let navigate = useNavigate();

    // onAuthStateChanged(auth, (currentUser) => {
    //     if (currentUser) localStorage.setItem("email", currentUser.email);            
    // });

    // const getUsers = async() => {
    //     const data = await getDocs(usersRef);
    //     setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    // };

    // const addUser = async() => {
    //     // await addDoc(usersRef, { name: newLogin, Password: newPassword })
    //     // setNewLogin("");
    //     // setNewPassword("");
    // }

    // useEffect(() => {
    //     getUsers();
    // }, []);

    const register = async () => {
        try {
            const userCreate = await createUserWithEmailAndPassword(
                auth, registerEmail, registerPassword
            );
            // userCreate();
            // localStorage.setItem("email", registerEmail);
            setUser((prev) => ({ ...prev, userName: registerEmail }));            
            // setRegisterEmail("")
            // setRegisterPassword("");
            navigate("/");            
        } 
        catch (error){
            errorCode = error.code;
            errorMessage = error.message;
            console.log(errorCode);
            console.log(errorMessage);
        }        
    };

    

    

    // const newPasswordHandler = (password) => {
    //     // setNewPassword(password)
    // };

    // const loginHandler = (email) => {
    //     // setEmail(email)
    // };

    // const passwordHandler = (password) => {
    //     // setPassword(password)
    // };

    // const changeHandler = async(id) => {
    //     const userDoc = doc(db, "users", id);
    //     // const newFields = { town: newTown };
    //     // await updateDoc(userDoc, newFields);
    // };

    // const deleteHandler = async(id) => {
    //     const userDoc = doc(db, "users", id);
    //     await deleteDoc(userDoc);
    // };

    
    
    return (        
        <Box className="signIn">            
            <Typography variant="h6">Register new user</Typography>
            <TextField placeholder="Enter an email" size="small" value={registerEmail} 
                onChange={(event) => setRegisterEmail(event.target.value)}/>
            <TextField placeholder="Enter a password" size="small" value={registerPassword}
                onChange={(event) => setRegisterPassword(event.target.value)}/>

            <Button variant="outlined" onClick={register}>Create a user</Button>                    
        </Box>
    );
}

export default SignIn;
