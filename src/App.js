import React, {Component} from 'react';
import {Affix, Alert, Layout} from "antd";
import {Route, Switch} from "react-router-dom";
import {loggedInUser, logInUser, logInUserWithOtp, logOutUser,} from "./app/utils/auth";
import AppBase from "./app/components/core/AppBase";
import Auth from "./app/components/auth/Auth";
import ReactGA from 'react-ga';

class App extends Component {
    constructor(props) {
        super(props);
        ReactGA.initialize('UA-143616458-1');

        this.state = {
            user: loggedInUser(),
            redirect: false,
            production: (window.location.hostname == 'clinic.bkarogyam.com')
        };
        // momenttz.tz.setDefault('Asia/Kolkata');

        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        console.log(window.location.hostname);
    }

    login(data, withOtp = true) {
        let that = this;
        let successFn = function () {
            let user = loggedInUser();
            that.setState({
                user: user,
            });
        };
        let errorFn = function () {

        };
        if (withOtp)
            logInUser(data, successFn, errorFn);
        else
            logInUserWithOtp({...data}, successFn, errorFn)
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
            {this.state.production ? null : <Affix>
                <Alert
                    message="Demo Version (Only for testing purposes)"
                    banner
                    closable
                />
            </Affix>}
            <Switch>
                <Route exact path="/login" render={() => <Auth {...this.state} login={this.login}/>}/>
                <Route exact path="/password-reset/:token"
                       render={(route) => <Auth {...route} {...this.state} login={this.login}/>}/>
                <Route render={(route) => (this.state.user ?
                    <AppBase {...this.state} {...route} {...this.props} logout={this.logout}/> :
                    <Auth {...this.state} login={this.login}/>)}/>
            </Switch>
        </Layout>
    }
}

export default App;
