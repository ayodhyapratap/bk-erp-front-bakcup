import React from "react";
import PracticeDetails from "./options/practice-detail/PracticeDetails"
import {Route, Switch} from 'react-router-dom';
import {Layout} from "antd";
import PracticeStaff from "./options/practice-staff/PracticeStaff";
import AddStaffDoctor from "./options/practice-staff/AddStaffDoctor";
import AddPracticeDetails from "./options/practice-detail/AddPracticeDetails";
import CommunicationSettings from "./options/communication-settings/CommunicationSettings";
import RecentProcedure from "./options/procedure-catalog/RecentProcedure";
import AddProcedure from "./options/procedure-catalog/AddProcedure";
import BillingSettings from "./options/billing/BillingSettings";
import EMRSettings from "./options/emr/EMRSettings";
import EditPracticeDetail from "./options/practice-detail/EditPracticeDetail";
import Prescriptions from "./options/prescriptions/Prescriptions";
import ExpensesTypes from "./options/expenses-types/ExpensesTypes";
import MedicalHistory from "./options/medical-history/MedicalHistory";
import Error404 from "../common/errors/Error404";
import CalendarSettings from "./options/calendar/CalendarSettings"
import SettingSider from "./SettingSider";
import PermissionDenied from "../common/errors/PermissionDenied";
import MlmBase from "./options/mlm/MlmBase";
import Printout from "./options/printout/Printout";
import IntegrationHome from "./options/integration/IntegrationHome";
import MailPDFSettings from "./options/mailPDF/MailPDFSettings";
import BedPackages from "./options/bed-packages/BedPackages";
import RoomTypes from "./options/roomtypes/RoomTypes";
import LoyaltySettings from "./options/loyalty/LoyaltySettings";
import LabTracking from "./options/labs/LabTracking";

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
                <SettingSider {...this.props}/>
                <Content style={{
                    margin: '24px 16px',
                    // padding: 24,
                    minHeight: 280,
                    // marginLeft: '200px'
                }}>
                    <Switch>
                        <Route exact path="/settings/clinics-staff"
                               render={(route) => (this.props.activePracticePermissions.SettingsPracticeStaff || this.props.allowAllPermissions ?
                                       <PracticeStaff  {...this.props} {...route} /> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/clinics-staff/adddoctor"
                               render={(route) => (this.props.activePracticePermissions.SettingsPracticeStaff || this.props.allowAllPermissions ?
                                       <AddStaffDoctor  {...this.props} {...route} /> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/clinics-staff/:doctorid/edit"
                               render={(route) => (this.props.activePracticePermissions.SettingsPracticeStaff || this.props.allowAllPermissions ?
                                       <AddStaffDoctor  {...this.props} {...route} /> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/clinics"
                               render={(route) => (this.props.activePracticePermissions.SettingsPracticeDetail || this.props.allowAllPermissions ?
                                       <PracticeDetails  {...this.props} {...route} /> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/clinics/add"
                               render={(route) => (this.props.activePracticePermissions.SettingsPracticeDetail || this.props.allowAllPermissions ?
                                       <AddPracticeDetails  {...this.props} {...route}/> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/clinics/:id/edit"
                               render={(route) => (this.props.activePracticePermissions.SettingsPracticeDetail || this.props.allowAllPermissions ?
                                       <EditPracticeDetail {...this.props}
                                                           practiceId={route.match.params.id} {...route}/> :
                                       <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/communication-settings"
                               render={(route) => (this.props.activePracticePermissions.SettingsCommunincations || this.props.allowAllPermissions ?
                                       <CommunicationSettings  {...this.props} {...route}/> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/calendarsettings"
                               render={(route) => (this.props.activePracticePermissions.SettingsCalendar || this.props.allowAllPermissions ?
                                       <CalendarSettings  {...this.props} {...route}/> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/procedures/addprocedure"
                               render={(route) => (this.props.activePracticePermissions.SettingsProcedureCatalog || this.props.allowAllPermissions ?
                                       <AddProcedure  {...this.props} {...route}/> : <PermissionDenied/>
                               )}/>
                        <Route path="/settings/procedures"
                               render={(route) => (this.props.activePracticePermissions.SettingsProcedureCatalog || this.props.allowAllPermissions ?
                                       <RecentProcedure  {...this.props} {...route}/> : <PermissionDenied/>
                               )}/>
                        <Route path="/settings/billing"
                               render={(route) => (this.props.activePracticePermissions.SettingsBilling || this.props.allowAllPermissions ?
                                       <BillingSettings  {...this.props} {...route}/> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/loyalty"
                               render={(route) => (this.props.activePracticePermissions.SettingsLoyalty || this.props.allowAllPermissions ?
                                       <LoyaltySettings  {...this.props} /> : <PermissionDenied/>
                               )}/>
                        <Route path="/settings/emr"
                               render={(route) => (this.props.activePracticePermissions.SettingsEMR || this.props.allowAllPermissions ?
                                       <EMRSettings  {...this.props} {...route}/> : <PermissionDenied/>
                               )}/>
                        {/*<Route exact path="/settings/loyalty/add"*/}
                        {/*render={(route) => (this.props.activePracticePermissions.SettingsLoyalty || this.props.allowAllPermissions ?*/}
                        {/*<AddOffer  {...this.props} {...route}/> : <PermissionDenied/>*/}
                        {/*)}/>*/}
                        <Route path="/settings/prescriptions"
                               render={(route) => (this.props.activePracticePermissions.SettingsPrescriptions || this.props.allowAllPermissions ?
                                       <Prescriptions  {...this.props} {...route} /> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/expense-types"
                               render={(route) => (this.props.activePracticePermissions.SettingsExpenseTypes || this.props.allowAllPermissions ?
                                       <ExpensesTypes  {...this.props} /> : <PermissionDenied/>
                               )}/>
                        <Route path="/settings/labs"
                               render={(route) => (this.props.activePracticePermissions.SettingsLabs || this.props.allowAllPermissions ?
                                       <LabTracking  {...this.props} {...route} /> : <PermissionDenied/>
                               )}/>
                        <Route exact path="/settings/medical-history"
                               render={(route) => (this.props.activePracticePermissions.SettingsMedicalHistory || this.props.allowAllPermissions ?
                                       <MedicalHistory  {...this.props} /> : <PermissionDenied/>
                               )}/>
                        <Route path="/settings/mlm"
                               render={(route) => (this.props.activePracticePermissions.SettingsMLMSettings || this.props.allowAllPermissions ?
                                       <MlmBase {...this.state}
                                                {...this.props}
                                                {...route}
                                                key={this.state.active_practiceId}/> : <PermissionDenied/>
                               )}/>
                        <Route path="/settings/printout"
                               render={(route) => (
                                   <Printout {...this.state}
                                             {...route}
                                             {...this.props}/>
                               )}/>
                        <Route path="/settings/mailpdfsettings"
                               render={(route) => (
                                   <MailPDFSettings {...this.state}
                                                    {...route}
                                                    {...this.props}/>
                               )}/>
                        <Route path="/settings/integration"
                               render={(route) => <IntegrationHome {...this.state}
                                                                   {...this.props}
                                                                   {...route}/>}/>
                        <Route exact path="/settings/roomtypes"
                               render={(route) => (this.props.activePracticePermissions.SettingsExpenseTypes || this.props.allowAllPermissions ?
                                       <RoomTypes  {...this.props} /> : <PermissionDenied/>
                               )}/>
                        <Route path="/settings/bed-packages"
                               render={(route) => <BedPackages {...this.state}
                                                               {...this.props}
                                                               {...route}/>}/>
                        <Route component={Error404}/>
                    </Switch>
                </Content>
            </Layout>
        </Content>
    }
}

export default SettingsDash;
