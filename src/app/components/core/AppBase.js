import React from "react";
import {Route, Switch} from "react-router-dom";
import AppHeader from "./AppHeader";
import {Layout} from "antd";
import AppFooter from "./AppFooter";


class AppBase extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Layout style={{minHeight: '100vh'}}>
            <AppHeader {...this.props}/>
            {/*  <AppSider/>*/}
            <Layout style={{padding: '24px 24px',}}>
                <div className="main-container" style={{minHeight: 'calc(100vh - 200px)'}}>
                    {/*<Switch>*/}
                        {/*<Route>Hello World</Route>*/}
                    {/*</Switch>*/}
                </div>
                <AppFooter/>
            </Layout>
        </Layout>;
    }
}
export default AppBase;
