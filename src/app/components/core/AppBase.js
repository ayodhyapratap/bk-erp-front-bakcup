import React from "react";
import {Route, Switch} from "react-router-dom";
import AppHeader from "./AppHeader";
import {Layout, Spin, Button, Input} from "antd";
import AppSider from "./AppSider";
import {loadUserDetails, loggedInactivePractice, loggedInUserPractices, setCurrentPractice} from "../../utils/auth";
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
import PermissionDenied from "../common/errors/PermissionDenied";
import SuggestionBox from "./SuggestionBox";
import ErrorBoundary from "../../../crashHandling/ErrorBoundary";
import MeetingBooking from "../conference/meeting/MeetingBooking";
import AlternateMedicineHome from "../alternateMedicine/AlternateMedicineHome";

const {TextArea} = Input;

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
            loadingPermissions: false,
            visible: false,

        };
        this.activeData = this.activeData.bind(this);
        // this.clinicData = this.clinicData.bind(this);
        this.switchPractice = this.switchPractice.bind(this);


    }

    componentDidMount() {
        this.activeData();

    }


    toggleSider = (option) => {
        this.setState({
            collapsed: !!option,
        });
    }

    activeData() {
        let that = this;
        let successFn = function (data) {
            that.setState(function (prevState) {
                let permissions = {};
                data.practice_permissions.forEach(function (permission) {
                    permissions[permission.codename] = permission;
                });
                data.global_permissions.forEach(function (permission) {
                    permissions[permission.codename] = permission;
                });
                return {
                    activePracticePermissions: permissions,
                    loadingPermissions: false,
                    practiceList: loggedInUserPractices(),
                }
            }, function () {
                // that.clinicData();
            });
        }
        let errorFn = function () {
            that.setState({
                loadingPermissions: false
            })
        }

        that.setState(function (prevState) {
            let activePracticeObj = null;
            prevState.practiceList.forEach(function (practiceObj) {
                if (practiceObj.practice.id == prevState.active_practiceId) {
                    activePracticeObj = practiceObj.practice
                }
            });
            if (activePracticeObj || !prevState.practiceList.length)
                return {
                    activePracticeData: activePracticeObj,
                    loadingPermissions: true
                }
            setCurrentPractice(prevState.practiceList[0].practice.id);
            return {
                activePracticeData: prevState.practiceList[0].practice,
                active_practiceId: prevState.practiceList[0].practice.id,
                loadingPermissions: true
            }
        }, function () {
            loadUserDetails(that.state.active_practiceId, successFn, errorFn);
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

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };
    onClose = () => {
        this.setState({
            visible: false,
        });
    };



    render() {
        let that = this;
        if (this.state.loadingPermissions) {
            return <Spin spinning={this.state.loadingPermissions} tip={"Loading Permissions...."}>
                <div style={{width: '100vw', height: '100vh'}}/>
            </Spin>
        }
        return <Layout style={{minHeight: '100vh'}}>
            <ErrorBoundary>
                <div style={{
                    position: 'fixed', right: '29px',
                    bottom: '23px', zIndex: '20'
                }}>
                    <Button type="primary" shape="circle" icon="mail" size={"large"} onClick={this.showDrawer}/>
                </div>
                <Switch>
                    <Route path={"/patients/patientprintform"}
                           render={(route) => <PrintPatientForm {...this.state} key={that.state.active_practiceId}/>}/>
                    <Route>
                        <Layout>
                            <AppSider toggleSider={this.toggleSider} {...this.state}
                                      key={that.state.active_practiceId} {...this.props} />
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
                                           render={(route) => (this.state.activePracticePermissions.AddAppointment || this.state.allowAllPermissions ?
                                               <CreateAppointment {...this.state}{...this.props} {...route}
                                                                  startTime={this.state.startTime}/> :
                                               <PermissionDenied/>)}/>

                                    <Route exact path="/calendar/:appointmentid/edit-appointment"
                                           render={(route) => (this.state.activePracticePermissions.EditAppointment || this.state.allowAllPermissions ?
                                               <CreateAppointment {...this.state}{...this.props} {...route}
                                                                  startTime={this.state.startTime}/> :
                                               <PermissionDenied/>)}/>
                                    <Route exact path="/calendar/blockcalendar"
                                           render={(route) => (that.state.activePracticePermissions.BlockCalendar || that.state.allowAllPermissions ?
                                               <BlockCalendar {...this.state} {...this.props} {...route}/> :
                                               <PermissionDenied/>)}/>
                                    <Route path="/calendar"
                                           render={(route) => (that.state.activePracticePermissions.ViewCalendar ?
                                               <Calendar {...that.state}
                                                         {...that.props}
                                                         {...route}
                                                         key={that.state.active_practiceId}/> : <PermissionDenied/>)}/>
                                    <Route path="/patient/:id" render={(route) => <PatientHome {...this.state}
                                                                                               {...this.props}
                                                                                               {...route}
                                                                                               key={that.state.active_practiceId + "|" + route.match.params.id}/>}/>

                                    <Route path="/settings" render={(route) => <SettingsDash {...this.state}
                                                                                             {...this.props}
                                                                                             {...route}
                                                                                             key={that.state.active_practiceId}
                                                                                             refreshClinicData={this.activeData}/>}/>
                                    <Route path="/inventory" render={(route) => <InventoryHome {...this.state}
                                                                                               {...this.props}
                                                                                               {...route}
                                                                                               key={that.state.active_practiceId}/>}/>
                                    <Route path="/reports/:type" render={(route) => <ReportsHome {...this.state}
                                                                                                 {...this.props}
                                                                                                 {...route}
                                                                                                 key={that.state.active_practiceId}/>}/>

                                    <Route path="/profile" render={(route) =>
                                        <Profile {...this.state}
                                                 {...this.props}
                                                 {...route} key={that.state.active_practiceId}/>}/>

                                    <Route path="/meeting-booking" render={(route)=>(this.state.activePracticePermissions.ViewMeeting || this.state.allowAllPermissions?
                                        <MeetingBooking  {...this.state} {...this.props} {...route}
                                                         key={that.state.active_practiceId}/>:<PermissionDenied/>)}/>
                                    {/*<Route path="/alternate-medicine" render={(route)=>(this.state.activePracticePermissions.ManageMedicineConversion || this.state.allowAllPermissions?*/}
                                    {/*    <AlternateMedicineHome  {...this.state} {...this.props} {...route}*/}
                                    {/*                     key={that.state.active_practiceId}/>:<PermissionDenied/>)}/>*/}

                                    {this.state.activePracticePermissions.ViewCalendar ?
                                        <Route exact path="/" render={(route) => <Calendar {...this.state}
                                                                                           {...this.props}
                                                                                           {...route}
                                                                                           key={that.state.active_practiceId}/>}/> : null}





                                    <Route path="/" render={(route) => <PatientHome {...this.state}
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
                <SuggestionBox {...this.state} close={this.onClose}/>
            </ErrorBoundary>
        </Layout>
            ;
    }
}

export default AppBase;
