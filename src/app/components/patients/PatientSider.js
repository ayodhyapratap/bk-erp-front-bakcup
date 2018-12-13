import React from "react";
import {Menu, Layout, Icon} from "antd";
import {Link} from "react-router-dom";

const Sider = Layout.Sider;

class PatientSider extends React.Component {
    render() {
        return <Sider trigger={null}
                      collapsible
                      collapsed={this.props.collapsed}
                      style={{overflow: 'auto', minHeight: '100vh', background: '#fff'}}>
            {/*<div className="logo"/>*/}
            <Menu mode="inline" defaultSelectedKeys={['5']}>
                <Menu.ItemGroup key="g1" title="Patient">
                    <Menu.Item key="17"><Link to="/patients/profile"><Icon type="user" />Profile</Link></Menu.Item>
                    <Menu.Item key="18"><Link to="/patients/appointments"><Icon type="calendar" />Appointments</Link></Menu.Item>
                    <Menu.Item key="19"><Link to="/patients/communications"><Icon type="message" />Communications</Link></Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup key="g2" title="EMR">
                    {/*<SubMenu key="nestedsub1" title={<span>EMR</span>}>*/}
                    <Menu.Item key="20"><Link to="/patients/emr/vitalsigns"><Icon type="heart" />Vital Signs</Link></Menu.Item>
                    <Menu.Item key="21"><Link to="/patients/emr/clinicnotes"><Icon type="solution" />Clinical Notes</Link></Menu.Item>
                    <Menu.Item key="22"><Link to="/patients/emr/workdone"><Icon type="check-circle" />Completed Procedure</Link></Menu.Item>
                    <Menu.Item key="23"><Link to="/patients/emr/files"><Icon type="picture" />Files</Link></Menu.Item>
                    <Menu.Item key="24"><Link to="/patients/emr/prescriptions"><Icon type="solution" />Prescriptions</Link></Menu.Item>
                </Menu.ItemGroup>
                {/*</SubMenu>*/}
                <Menu.ItemGroup key="g3" title="Billing">
                    <Menu.Item key="25"><Link to="/patients/billing/invoices"><Icon type="audit" />Invoices</Link></Menu.Item>
                    <Menu.Item key="26"><Link to="/patients/billing/payments"><Icon type="dollar" />Payments</Link></Menu.Item>
                </Menu.ItemGroup>
            </Menu>
        </Sider>
    }
}

export default PatientSider;
