import React, {Component} from 'react';
import {Layout} from "antd";
import {Route, Switch} from "react-router-dom";
import {
    loggedInUser,
    loggedInactivePractice,
    loggedInUserGroup,
    loggedInPermissions,
    loggedInUserPractices,
    logInUser,
    logOutUser,
    setCurrentPractice
} from "./app/utils/auth";
import AppBase from "./app/components/core/AppBase";
import Auth from "./app/components/auth/Auth";
import {getAPI, deleteAPI, interpolate} from "./app/utils/common";
import {ALL_PRACTICE, PRACTICE} from "./app/constants/api";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: loggedInUser(),
            permissions: loggedInPermissions(),
            // active_practiceId: loggedInactivePractice(),
            // practiceList: [],
            // activePracticeData: null,
            // specialisations: null,
            redirect: false,
        };
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        // this.activeData = this.activeData.bind(this);
        // this.clinicData();
        // this.switchPractice = this.switchPractice.bind(this);

    }

    // activeData() {
    //     let that = this;
    //     that.state.practiceList.forEach(function (practice) {
    //         console.log(practice);
    //         if (that.state.active_practiceId == practice.id) {
    //             that.setState({
    //                 activePracticeData: practice,
    //             })
    //
    //         }
    //     });
    // }
    //
    // switchPractice(practiceId) {
    //     console.log(practiceId);
    //     let that = this;
    //     that.setState({
    //         active_practiceId: practiceId,
    //     }, function () {
    //         setCurrentPractice(practiceId);
    //         that.activeData();
    //     });
    //
    //
    // }
    //
    // clinicData() {
    //     let group = loggedInUserGroup();
    //     if (Array.isArray(group) && group.length && group[0].name == "Admin") {
    //         var that = this;
    //         let successFn = function (data) {
    //             let specialisations = {};
    //             data[0].specialisations.forEach(function (speciality) {
    //                 specialisations[speciality.id] = speciality
    //             });
    //             console.log(specialisations);
    //
    //             that.setState({
    //                 practiceList: data,
    //                 specialisations: specialisations,
    //                 active_practiceId: data[0].id,
    //             }, function () {
    //                 that.activeData();
    //             })
    //         };
    //         let errorFn = function () {
    //         };
    //         getAPI(ALL_PRACTICE, successFn, errorFn);
    //     } else {
    //         let practice = loggedInUserPractices();
    //         // if(!Array.isArray(practice) || !practice.length)
    //         //     return true
    //         console.log(practice);
    //         var practiceKeys = Object.keys(practice);
    //         console.log(practiceKeys);
    //         var that = this;
    //         practiceKeys.forEach(function (key) {
    //             let successFn = function (data) {
    //                 that.setState(function (prevState) {
    //                     console.log(prevState)
    //                     let practiceArray = [];
    //                     let previousList = prevState.practiceList
    //                     practiceArray = practiceArray.concat(previousList);
    //                     practiceArray.push(data);
    //                     console.log(practiceArray);
    //                     // if(doctors==null){doctors=[];}
    //                     // if(staff==null){staff=[];}
    //                     // practiceArray.concat(data);
    //                     if (prevState.active_practiceId == data.id) {
    //                         return {
    //                             practiceList: practiceArray,
    //                             activePracticeData: data
    //                         }
    //                     }
    //                     return {
    //                         practiceList: practiceArray,
    //                     }
    //                 });
    //             }
    //             let errorFn = function () {
    //             };
    //             getAPI(interpolate(PRACTICE, [key]), successFn, errorFn);
    //
    //         });
    //     }
    // }

    login(data) {
        let that = this;
        let successFn = function () {
            let user = loggedInUser();
            that.setState({
                user: user,
                permissions: loggedInPermissions()
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

        // console.log(this.state.active_practiceId);
        return <Layout >
            <Switch>
                <Route exact path="/login" render={() => <Auth {...this.state} login={this.login}/>}/>
                <Route exact path="/password-reset/:token" render={(route) => <Auth {...route} {...this.state} login={this.login}/>}/>
                <Route render={() => (this.state.user ?
                    <AppBase {...this.state} logout={this.logout} /> :
                    <Auth {...this.state} login={this.login}/>)}/>
            </Switch>
        </Layout>
    }
}

export default App;
