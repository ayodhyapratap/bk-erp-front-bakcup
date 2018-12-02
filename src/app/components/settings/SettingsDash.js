import React from "react";
import PracticeDetails from "./options/practice-detail/PracticeDetails"
import {Route, Link, Switch} from 'react-router-dom';
import {Avatar, Dropdown, Icon, Layout, Menu} from "antd";
import SettingSider from "./SettingSider"

const Content = Layout.Content;

class SettingsDash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
        };
    }

    render() {
        return <div>
            {/*      <SettingSider/>*/}
            <Switch>
                <Route exact path="/settings" component={PracticeDetails}/>
            </Switch>
        </div>
    }

}

export default SettingsDash;
