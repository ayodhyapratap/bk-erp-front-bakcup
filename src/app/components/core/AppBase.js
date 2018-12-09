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
import PracticeDetails from "../settings/options/practice-detail/PracticeDetails";
import PracticeStaff from "../settings/options/practice-staff/PracticeStaff";
import AddStaffDoctor from "../settings/options/practice-staff/AddStaffDoctor";
import AddPracticeDetails from "../settings/options/practice-detail/AddPracticeDetails";
import CommunicationSettings from "../settings/options/communication-settings/CommunicationSettings";
import RecentProcedure from "../settings/options/procedure-catalog/RecentProcedure";
import AddProcedure from "../settings/options/procedure-catalog/AddProcedure";
import BillingSettings from "../settings/options/billing/BillingSettings";
import Offers from "../settings/options/loyalty/Offers";
import AddOffer from "../settings/options/loyalty/AddOffer";
import Error404 from "../common/errors/Error404";
import EditPracticeDetail from "../settings/options/practice-detail/EditPracticeDetail"
import EMRSettings from "../settings/options/emr/EMRSettings"
import Application from "./Calender";
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



    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    render() {
        return <Layout style={{minHeight: '100vh'}}>

            <AppSider {...this.state}/>
            <Layout>
                <AppHeader  switchPractice={this.switchPractice} {...this.state} {...this.state} toggleSider={this.toggle} {...this.state}/>
                <Content className="main-container"
                         style={{
                             margin: '24px 16px',
                             padding: 24,
                             minHeight: 280,
                             // marginLeft: '200px'
                         }}>

                    <Switch>
                        <Route exact path="/" component={Application}/>
                        <Route exact path="/settings" component={SettingsDash}/>
                        {this.props.permissions.view_practicestaff  ?<Route exact path="/settings/clinics-staff" render={(route) => <PracticeStaff  {...this.state}/>}/>:<Route component={Error404}/>}
                        {this.props.permissions.add_practicestaff  ?<Route exact path="/settings/clinics-staff/adddoctor" render={(route) => <AddStaffDoctor  {...this.state}/>}/>:<Route component={Error404}/>}
                        {this.props.permissions.view_practice  ?<Route exact path="/settings/clinics"   render={(route) => <PracticeDetails  {...this.state}/>}/>:<Route component={Error404}/>}
                        {this.props.permissions.add_practice   ?<Route exact path="/settings/clinics/add"  render={(route) => <AddPracticeDetails  {...this.state}/>}/>:<Route component={Error404}/>}
                        {this.props.permissions.view_practice  ?<Route exact path="/settings/communication-settings" render={(route) => <CommunicationSettings  {...this.state}/>}/>:<Route component={Error404}/>}
                        {this.props.permissions.view_procedurecatalog  ?<Route exact path="/settings/procedures" render={(route) => <RecentProcedure  {...this.state}/>}/>:<Route component={Error404}/>}
                        {this.props.permissions.add_procedurecatalog  ?<Route exact path="/settings/procedures/addprocedure" render={(route) => <AddProcedure  {...this.state}/>}/> :<Route component={Error404}/>}
                        {this.props.permissions.view_taxes  ?<Route exact path="/settings/billing" render={(route) => <BillingSettings  {...this.state}/>}/> :<Route component={Error404}/>}
                        {this.props.permissions.view_practiceoffers  ?<Route exact path="/settings/loyalty" render={(route) => <Offers  {...this.state}/>}/> :<Route component={Error404}/>}
                        {this.props.permissions.view_practiceoffers  ?<Route exact path="/settings/emr" render={(route) => <EMRSettings  {...this.state}/>}/> :<Route component={Error404}/>}
                        {this.props.permissions.add_practiceoffers  ?<Route exact path="/settings/loyalty/add" render={(route) => <AddOffer  {...this.state}/>}/> :<Route component={Error404}/>}
                        {this.props.permissions.change_practice  ?<Route exact path="/settings/clinics/:id/edit"
                              render={(route) => <EditPracticeDetail practiceId={route.match.params.id}/>}/>:<Route component={Error404}/>}

                        <Route component={Error404}/>
                    </Switch>
                    <AppFooter/>
                </Content>

            </Layout>

        </Layout>;
    }
}

export default AppBase;
