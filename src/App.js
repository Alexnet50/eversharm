import React, {useEffect, useState, useMemo, createContext} from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Container } from '@mui/material';
import {storage} from "./firebase-config";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import Home from "./pages/Home";
// import LogIn from "./pages/LogIn";
// import SignIn from "./pages/SignIn";
import CreateReview from "./pages/CreateReview";
import Header from "./pages/Header";
import CreateHotel from "./pages/CreateHotel";
import Hotel from "./pages/Hotel";


export const UserContext = createContext({
    user: {},
    setUser: () => {}    
});

let key = 0;

//ADMIN

//LOGIN: aladdin@ukr.net
//PASSWORD: login123

function App() {
    const [user, setUser] = useState({
        userName: null,
        isAdmin: false,
        currentHotel: null
    });    
    const value = useMemo(() => ({ user, setUser }), [user]);
    // const value = useMemo(() => ({ user, setUser, isAdmin, setIsAdmin }), []);        
    const [imageList, setImageList] = useState([]);
    // const imageListRef = ref(storage, "images/")  

    

    // useEffect(() => {        
    //     listAll(ref(storage, "images/")).then((response) => {
    //         setImageList([]);
    //         // let imageList = [];
    //         response.items.forEach((item) => {
    //             getDownloadURL(item).then((url) => {
    //                 // imageList.push(url);
    //                 setImageList((prev) => [...prev, url]); 
    //             })
    //         });
    //         // setImageList(imageList);
    //     })
    // }, [])
    // console.log(currentUser);

    return (
        <UserContext.Provider value={value}>
            <Container maxWidth="lg">
                <Router>
                    {/* {console.log(value)} */}
                    <Header />                        
                    <Routes>
                        <Route path="/" element={<Home /> } />
                        <Route path="/createhotel" element={<CreateHotel /> } />
                        {/* <Route path="/login" element={<LogIn /> } /> */}
                        {/* <Route path="/signin" element={<SignIn /> } /> */}
                        <Route path="/createreview" element={<CreateReview /> } />
                        <Route path="/hotel" element={<Hotel /> } />
                    </Routes>                    

                    
                </Router>      
            </Container>
        </UserContext.Provider>
              
            
            
        
        
                      
           
        
        
    );
}

export default App;

