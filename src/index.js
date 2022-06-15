import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 3000

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('src', path.join(__dirname, 'crc'))
//   .set('view engine', 'ejs')
  .get('/*', (req, res) => res.render('pages'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

