import {useEffect, useState, useContext} from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
// import {TextField, Box, FormGroup, Button, Container} from '@mui/material';
import {auth, db} from "../firebase-config";
import { UserContext } from '../App';
// import Home from "./pages/Home";
// import LogIn from "./pages/LogIn";
// import CreatePost from "./pages/CreatePost";

// import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from "firebase/firestore";
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";



function SignIn() {
    const {user, setUser} = useContext(UserContext);
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    

    let errorCode;
    let errorMessage;


    const emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/

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
            const user = await createUserWithEmailAndPassword(
                auth, registerEmail, registerPassword
            );
            // localStorage.setItem("email", registerEmail);
            setUser(registerEmail);
            setRegisterEmail("")
            setRegisterPassword("");
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
        // <Router>
        //     <nav>
        //         <Link to={"/"}><button>Home</button></Link>
        //         <Link to={"/login"}><button>Log In</button></Link>
        //         <Link to={"/createpost"}><button>Create Post</button></Link>



                
        //     </nav>
        //     <Routes>
        //         <Route path="/" element={<Home /> } />
        //         <Route path="/login" element={<LogIn /> } />
        //         <Route path="/createpost" element={<CreatePost /> } />
        //     </Routes>
        // </Router>

        <div className="signIn">
            <div>
                <h3>Register new user</h3>
                <input placeholder="Enter an email" value={registerEmail} 
                    onChange={(event) => setRegisterEmail(event.target.value)}/>
                <input placeholder="Enter a password"  value={registerPassword}
                    onChange={(event) => setRegisterPassword(event.target.value)}/>

                <button onClick={register}>Create a user</button>
            </div>         
            
            {/* <div>
                <h3>User logged in: {localStorage.getItem("email")}</h3>
                <button onClick={logOut}>Log out</button>
            </div>             */}
                        {/* <button onClick={() => changeHandler(user.id)}>Change town</button>
                        <button onClick={() => deleteHandler(user.id)}>Delete user</button> */}
                    
        </div>
    );
}

export default SignIn;
