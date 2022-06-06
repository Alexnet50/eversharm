import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';


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

