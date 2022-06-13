import React, {useEffect, useState, useMemo, createContext} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { Container, Typography } from '@mui/material';
import Home from "./pages/Home";
import CreateReview from "./pages/CreateReview";
import Header from "./pages/Header";
import CreateHotel from "./pages/CreateHotel";
import CreatePost from "./pages/CreatePost";
import Hotel from "./pages/Hotel";
import NewModal from "./pages/Modal";
import { auth } from "./firebase-config";
import Background from "./pages/Background";


export const UserContext = createContext({
    user: {},
    setUser: () => {}    
});

//ADMIN

//LOGIN: aladdin@ukr.net
//PASSWORD: login123

function App() {
    const [user, setUser] = useState({        
        isAdmin: false,
        currentHotel: null,
        openModal: false,
        modalContent: "",
        currentUser: null,
        pending: true
    });    
    const value = useMemo(() => ({ user, setUser }), [user]);
    const handleClose = () => setUser((prev) => ({ ...prev, openModal: false }));    

    
    useEffect(() => {
        auth.onAuthStateChanged((user) => { 
            // let isAdmin;          
            // newUser && newUser.email === "aladdin@ukr.net" ? isAdmin = true : isAdmin = false;                       
            setUser((prev) => ({ ...prev,
                currentUser: user ? user : null,
                isAdmin: (user?.email && user?.email === "aladdin@ukr.net") ? true : false,
                pending: false            
            })); 
            console.log(user.currentUser)           
        })
    }, []);  
  

    if(user.pending){
        return <Typography variant='h4' color="text.secondary" fontWeight="bold" sx={{ ml: 10, mt: 5 }} >Loading...</Typography>
      }

    return (
        <UserContext.Provider value={value}>
            <Background />
            <Container maxWidth="lg">
                <Router>                    
                    <Header />                        
                    <Routes>
                        <Route path="/" element={<Home /> } />
                        <Route path="/createhotel" element={<CreateHotel /> } />                        
                        <Route path="/createreview" element={<CreateReview /> } />
                        <Route path="/createpost" element={<CreatePost /> } />
                        <Route path="/hotel" element={<Hotel key={user.currentHotel} /> } />
                    </Routes>                    

                    <NewModal openModal={user.openModal} content={user.modalContent} handleClose={handleClose} />   
                </Router>      
            </Container>
        </UserContext.Provider>       
    );
}

export default App;

