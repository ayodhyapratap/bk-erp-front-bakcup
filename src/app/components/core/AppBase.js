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
import Error404 from "../common/errors/Error404";


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
                        <Route exact path="/" component={TestForm}/>
                        <Route exact path="/settings" component={SettingsDash}/>
                        <Route exact path="/settings/clinics-staff" component={PracticeStaff}/>
                        <Route exact path="/settings/clinics-staff/adddoctor" component={AddStaffDoctor}/>
                        <Route exact path="/settings/clinics" component={PracticeDetails}/>
                        <Route exact path="/settings/clinics/add" component={AddPracticeDetails}/>
                        <Route component={Error404}/>
                    </Switch>
                    <AppFooter/>
                </Content>

            </Layout>

        </Layout>;
    }
}

export default AppBase;
