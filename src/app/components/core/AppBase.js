import React from "react";
import {Route, Switch} from "react-router-dom";
import AppHeader from "./AppHeader";
import {Layout} from "antd";
import AppFooter from "./AppFooter";
import AppSider from "./AppSider";
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
        };
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
                <AppHeader {...this.props} toggleSider={this.toggle} {...this.state}/>
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
                        {this.props.permissions.view_practicestaff  ?<Route exact path="/settings/clinics-staff" render={(route) => <PracticeStaff  {...this.props}/>}/>:<Route component={Error404}/>}
                        {this.props.permissions.add_practicestaff  ?<Route exact path="/settings/clinics-staff/adddoctor" render={(route) => <AddStaffDoctor  {...this.props}/>}/>:<Route component={Error404}/>}
                        {this.props.permissions.view_practice  ?<Route exact path="/settings/clinics"   render={(route) => <PracticeDetails  {...this.props}/>}/>:<Route component={Error404}/>}
                        {this.props.permissions.add_practice   ?<Route exact path="/settings/clinics/add"  render={(route) => <AddPracticeDetails  {...this.props}/>}/>:<Route component={Error404}/>}
                        {this.props.permissions.view_practice  ?<Route exact path="/settings/communication-settings" render={(route) => <CommunicationSettings  {...this.props}/>}/>:<Route component={Error404}/>}
                        {this.props.permissions.view_procedurecatalog  ?<Route exact path="/settings/procedures" render={(route) => <RecentProcedure  {...this.props}/>}/>:<Route component={Error404}/>}
                        {this.props.permissions.add_procedurecatalog  ?<Route exact path="/settings/procedures/addprocedure" render={(route) => <AddProcedure  {...this.props}/>}/> :<Route component={Error404}/>}
                        {this.props.permissions.view_taxes  ?<Route exact path="/settings/billing" render={(route) => <BillingSettings  {...this.props}/>}/> :<Route component={Error404}/>}
                        {this.props.permissions.view_practiceoffers  ?<Route exact path="/settings/loyalty" render={(route) => <Offers  {...this.props}/>}/> :<Route component={Error404}/>}
                        {this.props.permissions.view_practiceoffers  ?<Route exact path="/settings/emr" render={(route) => <EMRSettings  {...this.props}/>}/> :<Route component={Error404}/>}
                        {this.props.permissions.add_practiceoffers  ?<Route exact path="/settings/loyalty/add" render={(route) => <AddOffer  {...this.props}/>}/> :<Route component={Error404}/>}
                        {this.props.permissions.change_practice  ?<Route exact path="/settings/clinics/:id/edit"
                              render={(route) => <EditPracticeDetail practiceId={this.props.active_practiceId}/>}/>:<Route component={Error404}/>}

                        <Route component={Error404}/>
                    </Switch>
                    <AppFooter/>
                </Content>

            </Layout>

        </Layout>;
    }
}

export default AppBase;
