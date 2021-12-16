import React, { Component, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import LoginPage from './components/LoginPage';
import { config } from 'scl-bistro/config';
import axios from 'axios';
import { MainPage } from './components/MainPage';

// if (!config.isProduction) {
//   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
// }

class IsLoggedIn extends Component<any, { msg: string }> {
  timer?: NodeJS.Timer;

  constructor(props: any) {
    super(props);
    this.state = { msg: "Are we logged in?" };
  }

  async fetchData() {
    let rep = await axios.get("/users/all");
    this.setState({ msg: rep.data })
  }

  componentDidMount() {
    this.fetchData();
    this.timer = setInterval(() => this.fetchData(), 10000);
  } 

  componentWillUnmount() {
    clearInterval(this.timer!);
  }

  render() {
    return <h1 id="myTest"> { this.state.msg } </h1>
  }
}

function App() {


  // const [token, setToken] = useState();
  // if (!token) {
  //   return <LoginPage setToken={setToken}/>
  // }


  return (
    <MainPage/>
    // <div className="App">
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.tsx</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
