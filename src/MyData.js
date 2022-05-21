import {useEffect, useState} from "react";
import {TextField, Box, FormGroup, Button, Container} from '@mui/material';
import {auth, db} from "./firebase-config";
import {collection, getDocs, addDoc, updateDoc, deleteDoc, doc} from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

export function MyData() {
    const [users, setUsers] = useState([]);
    const [newName, setNewName] = useState('');
    const [newTown, setNewTown] = useState('')

    
    const usersRef = collection(db, 'users');

    const getUsers = async() => {
        const data = await getDocs(usersRef);
        setUsers(data.docs.map((doc) => ({...doc.data(), id: doc.id})))
    };

    const addUser = async() => {
        await addDoc(usersRef, { name: newName, town: newTown })
        setNewName("");
        setNewTown("");
    }

    useEffect(() => {
        getUsers();
    }, []);

    const nameHandler = (name) => {
        setNewName(name)
    };

    const townHandler = (town) => {
        setNewTown(town)
    };

    const changeHandler = async(id) => {
        const userDoc = doc(db, "users", id);
        const newFields = { town: newTown };
        await updateDoc(userDoc, newFields);
    };

    const deleteHandler = async(id) => {
        const userDoc = doc(db, "users", id);
        await deleteDoc(userDoc);
    };


    return (
        <div className="App">
            <input placeholder="Enter a user`s name" value={newName} onChange={event => nameHandler(event.target.value)}/>
            <input placeholder="Enter a user`s town" value={newTown} onChange={event => townHandler(event.target.value)}/>

            <button onClick={addUser}>Add a user</button>

            {users.map((user => {
                return (
                    <>
                        <h2>Name: {user.name}</h2>
                        <h3>Town: {user.town}</h3>
                        <button onClick={() => changeHandler(user.id)}>Change town</button>
                        <button onClick={() => deleteHandler(user.id)}>Delete user</button>
                    </>
                    
                )
            }))}
        </div>
    );
}


