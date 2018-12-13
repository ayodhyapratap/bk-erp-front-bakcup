import React from "react";
import {Icon, Layout, Menu} from 'antd';
import {Link} from 'react-router-dom';
import Applogo from '../../assets/img/app_logo.png'

const Sider = Layout.Sider;
const SubMenu = Menu.SubMenu;

class AppSider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openKeys: ['sub1'],
        }
    }

    onOpenChange = (openKeys) => {
        const rootSubmenuKeys = ['sub1', 'sub2'];
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({openKeys});
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }

    render() {
        return <Sider
            // style={{background: '#fff'}}
            // collapsible
            // collapsed={this.props.collapsed}
            // style={{overflow: 'auto', height: '100vh', position: 'fixed', left: 0}}
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
                console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
                console.log(collapsed, type);
            }}>
            <img src={Applogo} alt="" style={{width: '100%'}}/>
            <Menu mode="inline" defaultSelectedKeys={['1']}
                  openKeys={this.state.openKeys}
                  onOpenChange={this.onOpenChange}
                  theme="dark">
                <Menu.Item key="1">
                    <Link to="/calendar">
                        <Icon type="schedule"/>
                        <span className="nav-text">Calender</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="26">
                    <Link to="/patients">
                        <Icon type="user"/>
                        <span className="nav-text">Patients</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="27">
                    <Link to="/reports">
                        <Icon type="bar-chart"/>
                        <span className="nav-text">Reports</span>
                    </Link>
                </Menu.Item>
                <Menu.Item key="5">
                    <Link to="/settings/clinics">
                        <Icon type="setting"/>
                        <span className="nav-text">Settings</span>
                    </Link>
                </Menu.Item>


            </Menu>
        </Sider>
    }
}

export default AppSider;
