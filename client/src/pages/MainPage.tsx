import axios from "axios";
import { Component } from "react";
import { onLogout } from "../utils/auth";
import LoginPage from "./LoginPage";
import Week from "./WeekPage";

export class MainPage extends Component<any, { loggedIn: boolean }> {
  
    constructor(props: any) {
      super(props);
      this.state = { loggedIn: localStorage.getItem("loggedIn") === "true" };
      if ("loggedIn" in props) {
        this.setState({ loggedIn: props.loggedIn });
      }

      this.onSuccessfulLogin = this.onSuccessfulLogin.bind(this);
      this.onUnauthorized = this.onUnauthorized.bind(this);
    }

    onSuccessfulLogin() {
        this.setState({ loggedIn: true} );
        localStorage.setItem("loggedIn", "true");
    }

    onUnauthorized() {
        this.setState({ loggedIn: false });
        onLogout();
    }

    async checkLogin() {
        let rep = await axios.get("/auth/login");
        let { loggedIn } = rep.data;

        this.setState({ loggedIn });
    }

    componentDidMount() {
        this.checkLogin();
    }

    render() {
        if (this.state.loggedIn)
            return (
                <div>
                    <Week onUnauthorized={ this.onUnauthorized }/>
                </div>
            )
        return <LoginPage onLogin={ this.onSuccessfulLogin }/>
    }
    
  }