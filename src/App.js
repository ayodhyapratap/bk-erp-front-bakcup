import React, {Component} from 'react';
import {Layout} from "antd";
import {Route, Switch} from "react-router-dom";
import {
    loggedInUser,
    logInUser,
    logOutUser,
} from "./app/utils/auth";
import AppBase from "./app/components/core/AppBase";
import Auth from "./app/components/auth/Auth";
import momenttz from 'moment-timezone';
import ReactGA from 'react-ga';

class App extends Component {
    constructor(props) {
        super(props);
        ReactGA.initialize('UA-143616458-1');

        this.state = {
            user: loggedInUser(),
            redirect: false,
        };
        // momenttz.tz.setDefault('Asia/Kolkata');

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    login(data) {
        let that = this;
        let successFn = function () {
            let user = loggedInUser();
            that.setState({
                user: user,
            });
        };
        let errorFn = function () {

        };
        logInUser(data, successFn, errorFn);
    }

    logout() {
        let that = this;
        let successFn = function () {
            that.setState({
                user: null
            });
        };
        let errorFn = function () {
        };
        logOutUser(successFn, errorFn);
    }

    render() {
        ReactGA.pageview(window.location.pathname + window.location.search);
        return <Layout>
            <Switch>
                <Route exact path="/login" render={() => <Auth {...this.state} login={this.login}/>}/>
                <Route exact path="/password-reset/:token"
                       render={(route) => <Auth {...route} {...this.state} login={this.login}/>}/>
                <Route render={(route) => (this.state.user ?
                    <AppBase {...this.state} {...route} logout={this.logout}/> :
                    <Auth {...this.state} login={this.login}/>)}/>
            </Switch>
        </Layout>
    }
}

export default App;
