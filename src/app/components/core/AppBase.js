import React from "react";
import {Route, Switch} from "react-router-dom";
import AppHeader from "./AppHeader";
import {Layout, Spin} from "antd";
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
import PrintPatientForm from "../patients/patient/PrintPatientForm";
import CreateAppointment from "../calendar/CreateAppointment";
import BlockCalendar from "../calendar/BlockCalendar";

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
        // this.clinicData = this.clinicData.bind(this);
        this.switchPractice = this.switchPractice.bind(this);
    }

    componentDidMount() {
        // this.activeData()
        let that = this;
        let successFn = function (data) {
            that.setState(function(prevState){
                let permissions = {};
                data.practice_permissions.forEach(function(permission){
                    permissions[permission.codename] = permission;
                });
                data.global_permissions.forEach(function(permission){
                    permissions[permission.codename] = permission;
                });
                return {
                    activePracticePermissions: permissions,
                }
            }, function () {
                // that.clinicData();
            });
        }
        loadUserDetails(this.state.active_practiceId, successFn);
    }

    toggleSider = (option) => {
        this.setState({
            collapsed: !!option,
        });
    }

    activeData() {
        let that = this;
        that.setState(function (prevState) {
            let permissions = {};
            let activePracticeObj = null
            prevState.practiceList.forEach(function (practiceObj) {
                if (practiceObj.practice.id == prevState.active_practiceId) {
                    // practiceObj.permissions_data.forEach(function (permission) {
                    //     permissions[permission.codename] = permission
                    // });
                    activePracticeObj = practiceObj.practice
                }
            });
            return {
                activePracticeData: activePracticeObj,
                // activePracticePermissions: permissions
            }
        })
    }

    switchPractice(practiceId) {
        let that = this;
        that.setState(function (prevState) {
            return {
                active_practiceId: practiceId,
            }
        }, function () {
            setCurrentPractice(practiceId);
            that.activeData();
        });


    }

    // clinicData() {
    //     var that = this;
    //     that.setState(function (prevState) {
    //         let returnObj = {};
    //         let practices = loggedInUserPractices();
    //         let flag = true;
    //         practices.forEach(function (practiceObj) {
    //             if (prevState.active_practiceId && prevState.active_practiceId == practiceObj.practice.id) {
    //                 let permissions = {};
    //                 // practiceObj.permissions_data.forEach(function (permission) {
    //                 //     permissions[permission.codename] = permission
    //                 // });
    //                 flag = false;
    //                 returnObj = {
    //                     activePracticeData: practiceObj.practice,
    //                     // activePracticePermissions: permissions,
    //                     active_practiceId: practiceObj.practice.id
    //                 }
    //             } else if (flag) {
    //                 let permissions = {};
    //                 practiceObj.permissions_data.forEach(function (permission) {
    //                     permissions[permission.codename] = permission
    //                 });
    //                 returnObj = {
    //                     activePracticeData: practiceObj.pratice,
    //                     // activePracticePermissions: permissions,
    //                     active_practiceId: practiceObj.pratice.id
    //                 }
    //             }
    //         });
    //         return returnObj;
    //     });
    // }


    render() {
        let that = this;
        return <Layout style={{minHeight: '100vh'}}>
            {/*<Spin spinning={!this.state.activePracticeData}>*/}
            <Switch>
                <Route path={"/patients/patientprintform"}
                       render={(route) => <PrintPatientForm {...this.state} key={that.state.active_practiceId}/>}/>
                <Route>
                    <Layout>
                        <AppSider toggleSider={this.toggleSider} {...this.state}
                                  key={that.state.active_practiceId}/>
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
                                                                                        key={that.state.active_practiceId}/>}/>
                                    : null}
                                <Route exact path="/calendar/create-appointment"
                                       render={(route) => <CreateAppointment {...this.state}{...this.props} {...route}
                                                                             startTime={this.state.startTime}/>}/>
                                <Route exact path="/calendar/:appointmentid/edit-appointment"
                                       render={(route) => <CreateAppointment {...this.state}{...this.props} {...route}
                                                                             startTime={this.state.startTime}/>}/>
                                <Route exact path="/calendar/blockcalendar"
                                       render={(route) => <BlockCalendar {...this.state} {...this.props} {...route}/>}/>
                                <Route path="/calendar" render={(route) => <Calendar {...this.state}
                                                                                     {...this.props}
                                                                                     {...route}
                                                                                     key={that.state.active_practiceId}/>}/>
                                <Route path="/patient/:id" render={(route) => <PatientHome {...this.state}
                                                                                           {...this.props}
                                                                                           {...route}
                                                                                           key={that.state.active_practiceId + "|" + route.match.params.id}/>}/>
                                <Route path="/patients" render={(route) => <PatientHome {...this.state}
                                                                                        {...this.props}
                                                                                        {...route}
                                                                                        key={that.state.active_practiceId}/>}/>
                                <Route path="/settings" render={(route) => <SettingsDash {...this.state}
                                                                                         {...this.props}
                                                                                         {...route}
                                                                                         key={that.state.active_practiceId}
                                                                                         refreshClinicData={this.clinicData}/>}/>
                                <Route path="/inventory" render={(route) => <InventoryHome {...this.state}
                                                                                           {...this.props}
                                                                                           {...route}
                                                                                           key={that.state.active_practiceId}/>}/>
                                <Route path="/reports" render={(route) => <ReportsHome {...this.state}
                                                                                       {...this.props}
                                                                                       {...route}
                                                                                       key={that.state.active_practiceId}/>}/>

                                <Route path="/profile" render={(route) => <Profile {...this.state}
                                                                                   {...this.props}
                                                                                   {...route}
                                                                                   key={that.state.active_practiceId}/>}/>
                                <Route exact path="/" render={(route) => <Calendar {...this.state}
                                                                                   {...this.props}
                                                                                   {...route}
                                                                                   key={that.state.active_practiceId}/>}/>
                                <Route component={Error404}/>

                            </Switch>
                            {/*<AppFooter/>*/}
                        </Layout>
                    </Layout>
                </Route>
            </Switch>
            {/*</Spin>*/}
        </Layout>;
    }
}

export default AppBase;
