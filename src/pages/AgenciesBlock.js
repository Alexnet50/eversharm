import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {collection, getDocs, deleteDoc, doc} from "firebase/firestore";
import {db} from "../firebase-config";
import { UserContext } from '../App';
import { Box, Button, Typography, Grid, Card,
     CardMedia, CardContent, CardActions, CardActionArea } from "@mui/material";

let agenciesList = [
    {
        agencyName: '',
        agencyLogo: '',
        agencyLink: ''
    },
    {
        agencyName: '',
        agencyLogo: '',
        agencyLink: ''
    },
    {
        agencyName: '',
        agencyLogo: '',
        agencyLink: ''
    }
]

export function AgenciesBlock() {

}