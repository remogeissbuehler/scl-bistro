import React, { Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginPage from './components/LoginPage';
// import { config } from 'scl-bistro/config';
import { config } from '../../config';
import axios from 'axios';
import { MainPage } from './components/MainPage';

// if (!config.isProduction) {
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// }

function App() {


  // const [token, setToken] = useState();
  // if (!token) {
  //   return <LoginPage setToken={setToken}/>
  // }


  return (
    <MainPage/>
  );
}

export default App;
