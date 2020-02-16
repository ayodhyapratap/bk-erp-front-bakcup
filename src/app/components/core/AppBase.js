import React from "react";
import {Route, Switch} from "react-router-dom";
import {Layout, Spin, Button} from "antd";
import loadable from '@loadable/component';
import AppHeader from "./AppHeader";
import AppSider from "./AppSider";
import {loadUserDetails, loggedInactivePractice, loggedInUserPractices, setCurrentPractice} from "../../utils/auth";
import Error404 from "../common/errors/Error404";
import Profile from "../auth/Profile";
import PrintPatientForm from "../patients/patient/PrintPatientForm";
import CreateAppointment from "../calendar/CreateAppointment";
import BlockCalendar from "../calendar/BlockCalendar";
import PermissionDenied from "../common/errors/PermissionDenied";
import SuggestionBox from "./SuggestionBox";
import ErrorBoundary from "../../../crashHandling/ErrorBoundary";

const Calendar = loadable(() => import('../calendar/Calendar'));
const ReportsHome = loadable(() => import('../reports/ReportsHome'));
const WebAdminHome = loadable(() => import('../webAdmin/WebAdminHome'));
const InventoryHome = loadable(() => import('../inventory/InventoryHome'));
const MeetingBooking = loadable(() => import('../conference/meeting/MeetingBooking'));
const SettingsDash = loadable(() => import('../settings/SettingsDash'));
const PatientHome = loadable(() => import('../patients/PatientHome'));

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
        const that = this;
        const successFn = function (data) {
            that.setState(function (prevState) {
                const permissions = {};
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
        const errorFn = function () {
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
        const that = this;
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
        const that = this;

        if (this.state.loadingPermissions) {
            return (
                <Spin spinning={this.state.loadingPermissions} tip="Loading Permissions....">
                    <div style={{width: '100vw', height: '100vh'}} />
                </Spin>
            )
        }
        return (
            <Layout style={{minHeight: '100vh'}}>
                <ErrorBoundary>
                    <div style={{
                        position: 'fixed', right: '29px',
                        bottom: '23px', zIndex: '20'
                    }}
                    >
                        <Button type="primary" shape="circle" icon="mail" size="large" onClick={this.showDrawer} />
                    </div>
                    <Switch>
                        <Route
                          path="/patients/patientprintform"
                          render={(route) => <PrintPatientForm {...this.state} key={that.state.active_practiceId} />}
                        />
                        <Route>
                            <Layout>
                                <AppSider
                                  toggleSider={this.toggleSider}
                                  {...this.state}
                                  key={that.state.active_practiceId}
                                  {...this.props}
                                />
                                <Layout>
                                    <AppHeader
                                      {...this.props}
                                      {...this.state}
                                      switchPractice={this.switchPractice}
                                      toggleSider={this.toggleSider}
                                    />
                                    <Switch>
                                        {this.state.activePracticePermissions.WebAdmin ? (
                                                <Route
                                                  path="/web"
                                                  render={(route) => (
                                                        <WebAdminHome
                                                          {...this.state}
                                                          {...this.props}
                                                          {...route}
                                                          key={that.state.active_practiceId}
                                                        />
                                                    )}
                                                />
                                            )
                                            : null}

                                        <Route
                                          exact
                                          path="/calendar/blockcalendar"
                                          render={(route) => (that.state.activePracticePermissions.BlockCalendar || that.state.allowAllPermissions ?
                                                <BlockCalendar {...this.state} {...this.props} {...route} /> :
                                                <PermissionDenied />)}
                                        />
                                        <Route
                                          path="/calendar"
                                          render={(route) => (that.state.activePracticePermissions.ViewCalendar ? (
                                                <Calendar
                                                  {...that.state}
                                                  {...that.props}
                                                  {...route}
                                                  key={that.state.active_practiceId}
                                                />
                                            ) : <PermissionDenied />)}
                                        />
                                        <Route
                                          path="/patient/:id"
                                          render={(route) => (
                                                <PatientHome
                                                  {...this.state}
                                                  {...this.props}
                                                  {...route}
                                                  key={`${that.state.active_practiceId}|${route.match.params.id}`}
                                                />
                                            )}
                                        />

                                        <Route
                                          path="/settings"
                                          render={(route) => (
                                                <SettingsDash
                                                  {...this.state}
                                                  {...this.props}
                                                  {...route}
                                                  key={that.state.active_practiceId}
                                                  refreshClinicData={this.activeData}
                                                />
                                            )}
                                        />
                                        <Route
                                          path="/inventory"
                                          render={(route) => (
                                                <InventoryHome
                                                  {...this.state}
                                                  {...this.props}
                                                  {...route}
                                                  key={that.state.active_practiceId}
                                                />
                                            )}
                                        />
                                        <Route
                                          path="/reports/:type"
                                          render={(route) => (
                                                <ReportsHome
                                                  {...this.state}
                                                  {...this.props}
                                                  {...route}
                                                  key={that.state.active_practiceId}
                                                />
                                            )}
                                        />

                                        <Route
                                          path="/profile"
                                          render={(route) => (
                                                <Profile
                                                  {...this.state}
                                                  {...this.props}
                                                  {...route}
                                                  key={that.state.active_practiceId}
                                                />
                                            )}
                                        />

                                        <Route
                                          path="/meeting-booking"
                                          render={(route) => (this.state.activePracticePermissions.ViewMeeting || this.state.allowAllPermissions ? (
                                                    <MeetingBooking
                                                      {...this.state}
                                                      {...this.props}
                                                      {...route}
                                                      key={that.state.active_practiceId}
                                                    />
                                                ) :
                                                <PermissionDenied />)}
                                        />
                                        {/* <Route path="/alternate-medicine" render={(route)=>(this.state.activePracticePermissions.ManageMedicineConversion || this.state.allowAllPermissions? */}
                                        {/*    <AlternateMedicineHome  {...this.state} {...this.props} {...route} */}
                                        {/*                     key={that.state.active_practiceId}/>:<PermissionDenied/>)}/> */}

                                        {this.state.activePracticePermissions.ViewCalendar ? (
                                            <Route
                                              exact
                                              path="/"
                                              render={(route) => (
                                                    <Calendar
                                                      {...this.state}
                                                      {...this.props}
                                                      {...route}
                                                      key={that.state.active_practiceId}
                                                    />
                                                )}
                                            />
                                        ) : null}


                                        <Route
                                          path="/"
                                          render={(route) => (
                                                <PatientHome
                                                  {...this.state}
                                                  {...this.props}
                                                  {...route}
                                                  key={that.state.active_practiceId}
                                                />
                                            )}
                                        />


                                        <Route component={Error404} />

                                    </Switch>
                                    {/* <AppFooter/> */}
                                </Layout>
                            </Layout>
                        </Route>
                    </Switch>
                    <SuggestionBox {...this.state} close={this.onClose} />
                </ErrorBoundary>
            </Layout>
        )
            ;
    }
}

export default AppBase;
