import React from "react";
import {Menu, Layout, Icon, Divider} from "antd";
import {Link} from "react-router-dom";

const Sider = Layout.Sider;

class PatientSider extends React.Component {

    render() {
        let that = this;
        return <Sider trigger={null}
                      collapsible

                      style={{overflow: 'auto', minHeight: 'calc(100vh - 64px)', background: '#fff'}}>
            {/*<div className="logo"/>*/}
            <Menu mode="inline">
                <Menu.ItemGroup key="g1" title={<Divider style={{margin: '0px'}}>Patient</Divider>}>
                    {/* {that.props.activePracticePermissions.ViewPatient || that.props.allowAllPermissions? */}
                    <Menu.Item key="17">
                        <Link
                            to={this.props.currentPatient ? "/patient/" + this.props.currentPatient.id + "/profile" : "/patients/profile"}>
                            <Icon type="user"/>Profile
                        </Link>
                    </Menu.Item>
                    {/* :null} */}
                    {that.props.activePracticePermissions.PatientAppointments || that.props.allowAllPermissions ?
                        <Menu.Item key="18">
                            <Link
                                to={this.props.currentPatient ? "/patient/" + this.props.currentPatient.id + "/appointments" : "/patients/appointments"}>
                                <Icon type="calendar"/>Appointments
                            </Link>
                        </Menu.Item>
                        : null}
                    {that.props.activePracticePermissions.PatientCommunications || that.props.allowAllPermissions ?
                        <Menu.Item key="19">
                            <Link
                                to={this.props.currentPatient ? "/patient/" + this.props.currentPatient.id + "/communications" : "/patients/communications"}>
                                <Icon type="message"/>Communications
                            </Link>
                        </Menu.Item>
                        : null}
                    {that.props.activePracticePermissions.PatientBookings || that.props.allowAllPermissions ?
                        <Menu.Item key="booking" disabled={!this.props.currentPatient}>
                            <Link
                                to={this.props.currentPatient ? "/patient/" + this.props.currentPatient.id + "/booking" : "/patients/communications"}>
                                <Icon type="book"/>Booking
                            </Link>
                        </Menu.Item>
                        : null}

                </Menu.ItemGroup>
                <Menu.ItemGroup key="g2" title={<Divider style={{margin: '0px'}}>EMR</Divider>}>
                    {/*<SubMenu key="nestedsub1" title={<span>EMR</span>}>*/}
                    {that.props.activePracticePermissions.PatientVitalSigns || that.props.allowAllPermissions ?
                        <Menu.Item key="20">
                            <Link
                                to={this.props.currentPatient ? "/patient/" + this.props.currentPatient.id + "/emr/vitalsigns" : "/patients/emr/vitalsigns"}>
                                <Icon type="heart"/>Report Manual</Link>
                        </Menu.Item>
                        : null}
                    {that.props.activePracticePermissions.PatientClinicalNotes || that.props.allowAllPermissions ?
                        <Menu.Item key="21">
                            <Link
                                to={this.props.currentPatient ? "/patient/" + this.props.currentPatient.id + "/emr/clinicnotes" : "/patients/emr/clinicnotes"}>
                                <Icon type="solution"/>Clinical Notes
                            </Link>
                        </Menu.Item>
                        : null}
                    {that.props.activePracticePermissions.PatientTreatmentPlans || that.props.allowAllPermissions ?
                        <Menu.Item key="30">
                            <Link
                                to={this.props.currentPatient ? "/patient/" + this.props.currentPatient.id + "/emr/plans" : "/patients/emr/plans"}>
                                <Icon type="read"/>Treatment Plans
                            </Link>
                        </Menu.Item>
                        : null}
                    {that.props.activePracticePermissions.PatientCompletedProcedure || that.props.allowAllPermissions ?
                        <Menu.Item key="22">
                            <Link
                                to={this.props.currentPatient ? "/patient/" + this.props.currentPatient.id + "/emr/workdone" : "/patients/emr/workdone"}>
                                <Icon type="check-circle"/>Completed Procedure
                            </Link>
                        </Menu.Item>
                        : null}
                    {that.props.activePracticePermissions.PatientFiles || that.props.allowAllPermissions ?
                        <Menu.Item key="23">
                            <Link
                                to={this.props.currentPatient ? "/patient/" + this.props.currentPatient.id + "/emr/files" : "/patients/emr/files"}>
                                <Icon type="picture"/>Files
                            </Link>
                        </Menu.Item>
                        : null}
                    {that.props.activePracticePermissions.PatientPrescriptions || that.props.allowAllPermissions ?
                        <Menu.Item key="24">
                            <Link
                                to={this.props.currentPatient ? "/patient/" + this.props.currentPatient.id + "/emr/prescriptions" : "/patients/emr/prescriptions"}>
                                <Icon type="solution"/>Prescriptions
                            </Link>
                        </Menu.Item>
                        : null}
                    {that.props.activePracticePermissions.PatientTimeline || that.props.allowAllPermissions ?
                        <Menu.Item key="25" disabled={!this.props.currentPatient}>
                            <Link
                                to={this.props.currentPatient ? "/patient/" + this.props.currentPatient.id + "/emr/timeline" : "/patients/profile"}>
                                <Icon type="clock-circle"/>Timeline
                            </Link>
                        </Menu.Item>
                        : null}
                    {that.props.activePracticePermissions.PatientLabOrders || that.props.allowAllPermissions ?
                        <Menu.Item key="26" disabled={!this.props.currentPatient || true}>
                            <Link
                                to={this.props.currentPatient ? "/patient/" + this.props.currentPatient.id + "/emr/labtrackings" : "/patients/profile"}>
                                <Icon type="solution"/>Lab Orders
                            </Link>
                        </Menu.Item>
                        : null}
                </Menu.ItemGroup>
                {/*</SubMenu>*/}
                <Menu.ItemGroup key="g3" title={<Divider style={{margin: '0px'}}>Billing</Divider>}>

                    {that.props.activePracticePermissions.PatientInvoices || that.props.allowAllPermissions ?
                        <Menu.Item key="27">
                            <Link
                                to={this.props.currentPatient ? "/patient/" + this.props.currentPatient.id + "/billing/invoices" : "/patients/billing/invoices"}>
                                <Icon type="audit"/>Invoices
                            </Link>
                        </Menu.Item>
                        : null}
                    {that.props.activePracticePermissions.PatientReturns || that.props.allowAllPermissions ?
                        <Menu.Item key="31">
                            <Link
                                to={this.props.currentPatient ? "/patient/" + this.props.currentPatient.id + "/billing/return/invoices" : "/patients/billing/return/invoices"}>
                                <Icon type="redo"/>Invoices Return
                            </Link>
                        </Menu.Item>
                        : null}
                    {that.props.activePracticePermissions.PatientPayments || that.props.allowAllPermissions ?
                        <Menu.Item key="28">
                            <Link
                                to={this.props.currentPatient ? "/patient/" + this.props.currentPatient.id + "/billing/payments" : "/patients/billing/payments"}>
                                <Icon type="dollar"/>Payments
                            </Link>
                        </Menu.Item>
                        : null}
                    {that.props.activePracticePermissions.PatientLedger || that.props.allowAllPermissions ?
                        <Menu.Item key="29" disabled={!this.props.currentPatient}>
                            <Link
                                to={this.props.currentPatient ? "/patient/" + this.props.currentPatient.id + "/billing/ledger" : "/patients/profile"}>
                                <Icon type="book"/>Ledger
                            </Link>
                        </Menu.Item>
                        : null}
                    {this.props.currentPatient && this.props.currentPatient.is_agent && (that.props.activePracticePermissions.PatientLedger || that.props.allowAllPermissions) ?
                        <Menu.Item key="32" disabled={!this.props.currentPatient}>
                            <Link
                                to={this.props.currentPatient ? "/patient/" + this.props.currentPatient.id + "/billing/wallet" : "/patients/profile"}>
                                <Icon type="wallet"/>Wallet Ledger
                            </Link>
                        </Menu.Item>
                        : null}
                </Menu.ItemGroup>
            </Menu>
        </Sider>
    }
}

export default PatientSider;
