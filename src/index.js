import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// import express from 'express';

// const app = express()

// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 3000;
// }
// app.listen(port);
// const express = require("express");
// require("dotenv").config();

// const app = express();
// const port = process.env.PORT || 3000;

// app.listen(port, () => {
//   console.log(`Server is running on the port ${port}.`);
// });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

