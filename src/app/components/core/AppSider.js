import React from "react";
import {Icon, Layout, Menu} from 'antd';
import {Link} from 'react-router-dom';


const Sider = Layout.Sider;
const SubMenu = Menu.SubMenu;

class AppSider extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Sider
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
            <div className="logo"/>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                <Menu.Item key="1">
                    <Icon type="user"/>
                    <span className="nav-text">nav 1</span>
                </Menu.Item>
                <SubMenu key="sub1" title={<span><Icon type="setting"/><span>Settings</span></span>}>
                    <Menu.Item key="5"><Link to="/settings/clinics">Practice Details</Link></Menu.Item>
                    <Menu.Item key="6"><Link to="/settings/clinics-staff">Practice Staff</Link></Menu.Item>
                    <Menu.Item key="7"><Link to="/settings/communication-settings">Communication Settings</Link></Menu.Item>
                    <Menu.Item key="8"><Link to="/settings/procedures">Procedure Catalog</Link></Menu.Item>
                    <Menu.Item key="9"><Link to="/settings/billing">Billing</Link></Menu.Item>
                    <Menu.Item key="10"><Link to="/settings/loyalty">Loyalty</Link></Menu.Item>
                    <Menu.Item key="11"><Link to="/settings/contacts"> Contacts</Link></Menu.Item>
                    <Menu.Item key="12"><Link to="/settings/emr"> EMR</Link></Menu.Item>
                    <Menu.Item key="13"><Link to="/settings/prescriptions"> Prescriptions</Link></Menu.Item>
                    <Menu.Item key="14"><Link to="/settings/labs">Labs</Link> </Menu.Item>
                    <Menu.Item key="15"><Link to="/settings/medical-history"> Medical History</Link></Menu.Item>
                    <Menu.Item key="16"><Link to="/settings/expense-types"> Expense Types</Link></Menu.Item>
                </SubMenu>

            </Menu>
        </Sider>
    }
}

export default AppSider;
