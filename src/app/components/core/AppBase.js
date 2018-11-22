import React from "react";
import {Route, Switch} from "react-router-dom";
import AppHeader from "./AppHeader";
import {Layout} from "antd";
import AppFooter from "./AppFooter";
import AppSider from "./AppSider";
import TestForm from "./TestForm";
import SettingsDash from "../settings/SettingsDash"


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
                             background: '#fff',
                             minHeight: 280,
                             marginLeft: '200px'
                         }}>

                    <Switch>
                      <Route exact path="/" component={TestForm} />
                      <Route exact path="/settings"  component={SettingsDash} />
                    </Switch>

                    {/*<Switch>*/}
                    {/*<Route>Hello World</Route>*/}
                    {/*</Switch>*/}

                </Content>
                <AppFooter/>
            </Layout>
        </Layout>;
    }
}

export default AppBase;
