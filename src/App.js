import React, {Component} from 'react';
import {Layout} from "antd";
import {Route, Switch} from "react-router-dom";
import {loggedInUser, logInUser, logOutUser} from "./app/utils/auth";
import AppBase from "./app/components/core/AppBase";
import LoginForm from "./app/components/auth/LoginForm";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: loggedInUser(),
            redirect: false,
        };
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    login(data) {
        let that = this;
        let successFn = function () {
            let user = loggedInUser();
            that.setState({
                user: user,
                // redirect: true
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
        return <Layout style={{height: '100px'}}>
            <Switch>
                <Route exact path="/login" render={() => <LoginForm {...this.state} login={this.login}/>}/>
                <Route render={() => (this.user || 1==1 ? <AppBase {...this.state} logout={this.logout}/> :
                    <LoginForm {...this.state} login={this.login}/>)}/>
            </Switch>
        </Layout>
    }
}

export default App;
