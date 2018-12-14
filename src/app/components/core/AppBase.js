import React from "react";
import {Route, Switch} from "react-router-dom";
import AppHeader from "./AppHeader";
import {Layout} from "antd";
import AppFooter from "./AppFooter";
import AppSider from "./AppSider";
import {
    loggedInUser,
    loggedInactivePractice,
    loggedInUserGroup,
    loggedInPermissions,
    loggedInUserPractices,
    logInUser,
    logOutUser,
    setCurrentPractice
} from "../../utils/auth";
import {getAPI, deleteAPI, interpolate} from "../../utils/common";
import {ALL_PRACTICE, PRACTICE} from "../../constants/api";


//settings
import TestForm from "./TestForm";
import SettingsDash from "../settings/SettingsDash"

import Calendar from "../calendar/Calendar";
import PatientHome from "../patients/PatientHome";
import Error404 from "../common/errors/Error404";

const Content = Layout.Content;

class AppBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            active_practiceId: loggedInactivePractice(),
            practiceList: [],
            activePracticeData: null,
            specialisations: null,
        };
        this.activeData = this.activeData.bind(this);
        this.clinicData();
        this.switchPractice = this.switchPractice.bind(this);

    }
    toggleSider = (option) => {
        this.setState({
            collapsed: !!option,
        });
    }
    activeData() {
        let that = this;
        that.state.practiceList.forEach(function (practice) {
            console.log(practice);
            if (that.state.active_practiceId == practice.id) {
                that.setState({
                    activePracticeData: practice,
                })

            }
        });
    }

    switchPractice(practiceId) {
        console.log(practiceId);
        let that = this;
        that.setState({
            active_practiceId: practiceId,
        }, function () {
            setCurrentPractice(practiceId);
            window.location.reload();
            that.activeData();
        });


    }

    clinicData() {
        let group = loggedInUserGroup();
        if (Array.isArray(group) && group.length && group[0].name == "Admin") {
            var that = this;
            let successFn = function (data) {
                let specialisations = {};
                data[0].specialisations.forEach(function (speciality) {
                    specialisations[speciality.id] = speciality
                });
                console.log(specialisations);

                that.setState({
                    practiceList: data,
                    specialisations: specialisations,
                    active_practiceId: data[0].id,
                }, function () {
                    that.activeData();
                })
            };
            let errorFn = function () {
            };
            getAPI(ALL_PRACTICE, successFn, errorFn);
        } else {
            let practice = loggedInUserPractices();
            // if(!Array.isArray(practice) || !practice.length)
            //     return true
            console.log(practice);
            var practiceKeys = Object.keys(practice);
            console.log(practiceKeys);
            var that = this;
            practiceKeys.forEach(function (key) {
                let successFn = function (data) {
                    that.setState(function (prevState) {
                        console.log(prevState)
                        let practiceArray = [];
                        let previousList = prevState.practiceList
                        practiceArray = practiceArray.concat(previousList);
                        practiceArray.push(data);
                        console.log(practiceArray);
                        // if(doctors==null){doctors=[];}
                        // if(staff==null){staff=[];}
                        // practiceArray.concat(data);
                        if (prevState.active_practiceId == data.id) {
                            return {
                                practiceList: practiceArray,
                                activePracticeData: data
                            }
                        }
                        return {
                            practiceList: practiceArray,
                        }
                    });
                }
                let errorFn = function () {
                };
                getAPI(interpolate(PRACTICE, [key]), successFn, errorFn);

            });
        }
    }



    render() {
        return <Layout style={{minHeight: '100vh'}}>

            <AppSider toggleSider={this.toggleSider} {...this.state}/>
            <Layout>
                <AppHeader {...this.props} switchPractice={this.switchPractice} {...this.state}
                           toggleSider={this.toggleSider}/>
                <Switch>
                    <Route path="/calendar" render={(route) => <Calendar {...this.state} {...this.props} {...route}/>}/>
                    <Route path="/patient/:id" render={(route) => <PatientHome {...this.state} {...this.props}/>}/>
                    <Route path="/patients" render={(route) => <PatientHome {...this.state} {...this.props}/>}/>
                    <Route path="/settings" render={(route) => <SettingsDash {...this.state} {...this.props}/>}/>
                    <Route component={Error404}/>
                    <AppFooter/>

                </Switch>
            </Layout>

        </Layout>;
    }
}

export default AppBase;
