import React, {useEffect, useState, useContext, useMemo, Provider} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import {auth, db, storage} from "./firebase-config";
import { ref, uploadBytes, listAll, getDownloadURL, list } from "firebase/storage";
import { v4 } from "uuid";
import Home from "./pages/Home";
import LogIn from "./pages/LogIn";
import SignIn from "./pages/SignIn";
import CreateReview from "./pages/CreateReview";




import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

let key = 0;

function App() {
    const [isAuth, setIsAuth] = useState(false);
    const [imageUpload, setImageUpload] = useState(null);
    const [imageList, setImageList] = useState([]);

    const imageListRef = ref(storage, "images/")

    const signUserOut = () => {
        signOut(auth).then(() => {
        //   localStorage.clear();
            setIsAuth(false);
        //   window.location.pathname = "/";
        });
    };

    

    const uploadImage = () => {
        if (imageUpload == null) return;
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageList((prev) => [...prev, url])
            })
        })
    }

    useEffect(() => {
        setImageList([]);
        listAll(ref(storage, "images/")).then((response) => {
            response.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setImageList((prev) => [...prev, url]); 
                })
            })
        })
    }, [])
    // console.log(currentUser);

    return (
        <>
        <Router> 
            <nav>
                <Link to={"/"}><button>Home</button></Link>
                {!isAuth && <Link to={"/signin"}><button>Sign In</button></Link>}
                {!isAuth && <Link to={"/login"}><button>Log In</button></Link>}
                {isAuth && 
                    <>
                        <Link to={"/createreview"}><button>Create A Review</button></Link>
                        <button onClick={signUserOut}>Log out</button>
                        <input type="file" onChange={(event) => setImageUpload(event.target.files[0])} />
                        <button onClick={uploadImage}>Upload image</button>
                    </>
                }           
            </nav>
            <Routes>
                <Route path="/" element={<Home isAuth={isAuth}/> } />
                <Route path="/login" element={<LogIn setIsAuth={setIsAuth}/> } />
                <Route path="/signin" element={<SignIn setIsAuth={setIsAuth}/> } />
                <Route path="/createreview" element={<CreateReview isAuth={isAuth}/> } />
            </Routes>
        </Router>

            {isAuth && <h3>User logged in: {auth.currentUser.email}</h3>}
            {console.log(imageList)}
            {imageList.map((url) => {
                key++;
                return <img src={url} key={key} />
            })}
        
        
        {/* // <UserContext.Provider value={value}> */}
                      
           
        </>
        
    );
}

export default App;
