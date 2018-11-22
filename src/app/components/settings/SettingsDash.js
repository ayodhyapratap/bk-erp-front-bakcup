import React from "react";
import PracticeDetails from "./options/PracticeDetails"
import CommunicationSettings from "./options/CommunicationSettings"
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
      return  <Layout className="main-container"
                 style={{
                     margin: '24px 16px',
                     padding: 24,
                     background: '#fff',
                     minHeight: 280,
                     marginLeft: '200px'
                 }}>
{/*      <SettingSider/>*/}
      <Switch>
        <Route exact path="/settings" component={PracticeDetails} />
        <Route exact path="/settings/communicationsettings" component={CommunicationSettings} />

      </Switch>
      </Layout>
    }

}
export default SettingsDash;
