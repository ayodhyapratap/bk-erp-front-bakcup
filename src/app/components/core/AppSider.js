import React from "react";
import {Icon, Layout, Menu} from 'antd';
import {Link} from 'react-router-dom';
import Applogo from '../../assets/img/app_logo.png'

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
            <img src={Applogo} alt="" style={{width:'100%'}}/>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                <Menu.Item key="1">
                    <Icon type="user"/>
                    <span className="nav-text">nav 1</span>
                </Menu.Item>
                <SubMenu key="sub1" title={<span><Icon type="setting"/><span>Settings</span></span>}>
                    <Menu.Item key="5"><Link to="/settings/clinics">Practice Details</Link></Menu.Item>
                    <Menu.Item key="6"><Link to="/settings/clinics-staff">Practice Staff</Link></Menu.Item>
{/*                    <Menu.Item key="7"><Link to="/settings/communication-settings">Communication Settings</Link></Menu.Item>*/}
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
                <SubMenu key="sub2" title={<span><Icon type="user"/><span>Paitients</span></span>}>
                  <Menu.Item key="17"><Link to="/patients/profile">Profile</Link></Menu.Item>
                  <Menu.Item key="18"><Link to="/patients/appointments">Appointments</Link></Menu.Item>
                  <Menu.Item key="19"><Link to="/patients/communications">Communications</Link></Menu.Item>
                  <SubMenu key="nestedsub1" title={<span>EMR</span>}>
                    <Menu.Item key="20"><Link to="emr/patients/vitalsigns">Vitalsings</Link></Menu.Item>
                    <Menu.Item key="21"><Link to="emr/patients/clinicnotes">Profile</Link></Menu.Item>
                    <Menu.Item key="22"><Link to="emr/patients/workdone">Profile</Link></Menu.Item>
                    <Menu.Item key="23"><Link to="emr/patients/files">Profile</Link></Menu.Item>
                    <Menu.Item key="24"><Link to="emr/patients/prescriptions">Profile</Link></Menu.Item>
                  </SubMenu>
                  <SubMenu key="nestedsub2" title={<span>Billing</span>}>
                  <Menu.Item key="25"><Link to="billing/patients/invoices">Invoices</Link></Menu.Item>
                  <Menu.Item key="26"><Link to="billing/patients/payments">Payments</Link></Menu.Item>

                  </SubMenu>

                </SubMenu>


            </Menu>
        </Sider>
    }
}

export default AppSider;
