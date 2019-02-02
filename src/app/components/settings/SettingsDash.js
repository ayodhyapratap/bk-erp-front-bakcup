import React from "react";
import PracticeDetails from "./options/practice-detail/PracticeDetails"
import {Route, Link, Switch} from 'react-router-dom';
import {Avatar, Dropdown, Icon, Layout, Menu} from "antd";
import PracticeStaff from "./options/practice-staff/PracticeStaff";
import AddStaffDoctor from "./options/practice-staff/AddStaffDoctor";
import AddPracticeDetails from "./options/practice-detail/AddPracticeDetails";
import CommunicationSettings from "./options/communication-settings/CommunicationSettings";
import RecentProcedure from "./options/procedure-catalog/RecentProcedure";
import AddProcedure from "./options/procedure-catalog/AddProcedure";
import BillingSettings from "./options/billing/BillingSettings";
import Offers from "./options/loyalty/Offers";
import EMRSettings from "./options/emr/EMRSettings";
import AddOffer from "./options/loyalty/AddOffer";
import EditPracticeDetail from "./options/practice-detail/EditPracticeDetail";
import Prescriptions from "./options/prescriptions/Prescriptions";
import AddPrescription from "./options/prescriptions/AddPrescription";
import ExpensesTypes from "./options/expenses-types/ExpensesTypes";
import LabTest from "./options/labs/LabTest";
import MedicalHistory from "./options/medical-history/MedicalHistory";
import Error404 from "../common/errors/Error404";
import CalendarSettings from "./options/calendar/CalendarSettings"
import SettingSider from "./SettingSider";
import PermissionDenied from "../common/errors/PermissionDenied";
import AddorEditLab from "./options/labs/AddorEditLab";

const Content = Layout.Content;

class SettingsDash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        };
    }

    render() {
        return <Content className="main-container"
                        style={{
                            // margin: '24px 16px',
                            // padding: 24,
                            minHeight: 280,
                            // marginLeft: '200px'
                        }}>
            <Layout>
                <SettingSider/>
                <Content style={{
                    margin: '24px 16px',
                    // padding: 24,
                    minHeight: 280,
                    // marginLeft: '200px'
                }}>
                    <Switch>
                        <Route exact path="/settings/clinics-staff"
                               render={(route) => (this.props.permissions.view_practicestaff || this.props.allowAllPermissions ?
                                       <PracticeStaff  {...this.props} {...route}/> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/clinics-staff/adddoctor"
                               render={(route) => (this.props.permissions.add_practicestaff || this.props.allowAllPermissions ?
                                       <AddStaffDoctor  {...this.props} {...route}/> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/clinics-staff/:doctorid/edit"
                               render={(route) => (this.props.permissions.add_practicestaff || this.props.allowAllPermissions ?
                                       <AddStaffDoctor  {...this.props} {...route}/> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/clinics"
                               render={(route) => (this.props.permissions.view_practice || this.props.allowAllPermissions ?
                                       <PracticeDetails  {...this.props} {...route}/> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/clinics/add"
                               render={(route) => (this.props.permissions.add_practice || this.props.allowAllPermissions ?
                                       <AddPracticeDetails  {...this.props}/> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/clinics/:id/edit"
                               render={(route) => (this.props.permissions.change_practice || this.props.allowAllPermissions ?
                                   <EditPracticeDetail {...this.props} practiceId={route.match.params.id}/> :
                                   <PermissionDenied/>)
                               }/>
                        <Route exact path="/settings/communication-settings"
                               render={(route) => (this.props.permissions.view_practice || this.props.allowAllPermissions ?
                                       <CommunicationSettings  {...this.props}/> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/calendarsettings"
                               render={(route) => (this.props.permissions.view_practicestaff || this.props.allowAllPermissions ?
                                       <CalendarSettings  {...this.props}/> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/procedures"
                               render={(route) => (this.props.permissions.view_procedurecatalog || this.props.allowAllPermissions ?
                                       <RecentProcedure  {...this.props}/> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/procedures/addprocedure"
                               render={(route) => (this.props.permissions.add_procedurecatalog || this.props.allowAllPermissions ?
                                       <AddProcedure  {...this.props}/> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/billing"
                               render={(route) => (this.props.permissions.view_taxes || this.props.allowAllPermissions ?
                                       <BillingSettings  {...this.props}/> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/loyalty"
                               render={(route) => (this.props.permissions.view_practiceoffers || this.props.allowAllPermissions ?
                                       <Offers  {...this.props}/> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/emr"
                               render={(route) => (this.props.permissions.view_practiceoffers || this.props.allowAllPermissions ?
                                       <EMRSettings  {...this.props}/> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/loyalty/add"
                               render={(route) => (this.props.permissions.add_practiceoffers || this.props.allowAllPermissions ?
                                       <AddOffer  {...this.props}/> : <PermissionDenied/>
                               )}/>

                        <Route path="/settings/prescriptions"
                               render={(route) => <Prescriptions  {...this.props} {...route}/>}/>

                        <Route exact path="/settings/expense-types"
                               render={() => <ExpensesTypes  {...this.props}/>}/>
                        <Route path="/settings/labs"
                               render={(route) => <LabTest  {...this.props} {...route}/>}/>
                        <Route exact path="/settings/medical-history"
                               render={() => <MedicalHistory  {...this.props}/>}/>
                        <Route component={Error404}/>
                    </Switch>
                </Content>
            </Layout>
        </Content>
    }

}

export default SettingsDash;
