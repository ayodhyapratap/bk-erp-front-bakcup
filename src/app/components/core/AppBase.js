import React from "react";
import {Route, Switch} from "react-router-dom";
import AppHeader from "./AppHeader";
import {Layout} from "antd";
import AppFooter from "./AppFooter";
import AppSider from "./AppSider";
import {
    loggedInactivePractice,
    loggedInUserPractices,
    setCurrentPractice, loadUserDetails
} from "../../utils/auth";
import SettingsDash from "../settings/SettingsDash"
import Calendar from "../calendar/Calendar";
import PatientHome from "../patients/PatientHome";
import Error404 from "../common/errors/Error404";
import ReportsHome from "../reports/ReportsHome";
import WebAdminHome from "../webAdmin/WebAdminHome";
import InventoryHome from "../inventory/InventoryHome";
import Profile from "../auth/Profile";

class AppBase extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            active_practiceId: loggedInactivePractice(),
            practiceList: loggedInUserPractices(),
            activePracticeData: null,
            activePracticePermissions: {},
            specialisations: null,
            allowAllPermissions: false,
        };
        this.activeData = this.activeData.bind(this);
        this.clinicData = this.clinicData.bind(this);
        this.switchPractice = this.switchPractice.bind(this);
    }

    componentDidMount() {
        let that = this;
        let successFn = function () {
            that.setState({
                active_practiceId: loggedInactivePractice(),
                practiceList: loggedInUserPractices()
            }, function () {
                that.clinicData();
            });
        }
        loadUserDetails(successFn);

    }

    toggleSider = (option) => {
        this.setState({
            collapsed: !!option,
        });
    }

    activeData() {
        let that = this;
        that.state.practiceList.forEach(function (practiceObj) {
            let permissions = {};
            practiceObj.permissions_data.forEach(function (permission) {
                permissions[permission.codename] = permission
            });
            that.setState({
                activePracticeData: practiceObj.pratice,
                activePracticePermissions: permissions
            })
        });
    }

    switchPractice(practiceId) {
        let that = this;
        that.setState({
            active_practiceId: practiceId,
        }, function () {
            setCurrentPractice(practiceId);
            that.activeData();
        });


    }

    clinicData() {
        var that = this;
        that.setState(function (prevState) {
            let returnObj = {}
            let practices = loggedInUserPractices();
            practices.forEach(function (practiceObj) {
                if (prevState.active_practiceId && prevState.active_practiceId == practiceObj.pratice.id) {
                    let permissions = {};
                    practiceObj.permissions_data.forEach(function (permission) {
                        permissions[permission.codename] = permission
                    });
                    returnObj = {
                        activePracticeData: practiceObj.pratice,
                        activePracticePermissions: permissions
                    }
                } else {
                    let permissions = {};
                    practiceObj.permissions_data.forEach(function (permission) {
                        permissions[permission.codename] = permission
                    });
                    returnObj = {
                        activePracticeData: practiceObj.pratice,
                        activePracticePermissions: permissions,
                        active_practiceId: practiceObj.pratice.id
                    }
                }
            });
            return returnObj;
        });
    }


    render() {
        return <Layout style={{minHeight: '100vh'}}>

            <AppSider toggleSider={this.toggleSider} {...this.state}/>
            <Layout>
                <AppHeader {...this.props}
                           {...this.state}
                           switchPractice={this.switchPractice}
                           toggleSider={this.toggleSider}/>
                <Switch>
                    {this.state.activePracticePermissions.WebAdmin ?
                        <Route path="/web" render={(route) => <WebAdminHome {...this.state}
                                                                            {...this.props}
                                                                            {...route}
                                                                            key={this.state.active_practiceId}/>}/>
                        : null}
                    <Route path="/calendar" render={(route) => <Calendar {...this.state}
                                                                         {...this.props}
                                                                         {...route}
                                                                         key={this.state.active_practiceId}/>}/>
                    <Route path="/patient/:id" render={(route) => <PatientHome {...this.state}
                                                                               {...this.props}
                                                                               {...route}
                                                                               key={this.state.active_practiceId}/>}/>
                    <Route path="/patients" render={(route) => <PatientHome {...this.state}
                                                                            {...this.props}
                                                                            {...route}
                                                                            key={this.state.active_practiceId}/>}/>
                    <Route path="/settings" render={(route) => <SettingsDash {...this.state}
                                                                             {...this.props}
                                                                             {...route}
                                                                             key={this.state.active_practiceId}
                                                                             refreshClinicData={this.clinicData}/>}/>
                    <Route path="/inventory" render={(route) => <InventoryHome {...this.state}
                                                                               {...this.props}
                                                                               {...route}
                                                                               key={this.state.active_practiceId}/>}/>
                    <Route path="/reports" render={(route) => <ReportsHome {...this.state}
                                                                           {...this.props}
                                                                           {...route}
                                                                           key={this.state.active_practiceId}/>}/>

                    <Route path="/profile" render={(route) => <Profile {...this.state}
                                                                       {...this.props}
                                                                       {...route}
                                                                       key={this.state.active_practiceId}/>}/>
                    <Route exact path="/" render={(route) => <Calendar {...this.state}
                                                                       {...this.props}
                                                                       {...route}
                                                                       key={this.state.active_practiceId}/>}/>
                    <Route component={Error404}/>
                    <AppFooter/>
                </Switch>
            </Layout>

        </Layout>;
    }
}

export default AppBase;
