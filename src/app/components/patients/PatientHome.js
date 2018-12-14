import React from "react";

import {Layout} from "antd";
import {Redirect, Route} from "react-router";
import PatientProfile from "./patient/PatientProfile";
import EditPatientDetails from "./patient/EditPatientDetails";
import Appointment from "./appointment/Appointment"
import PatientSider from "./PatientSider";
import PatientTimeline from "./timeline/PatientTimeline";
import PatientFiles from "./files/PatientFiles";
import PatientClinicNotes from "./clinicNotes/PatientClinicNotes";
import PatientHeader from "./PatientHeader";
import PatientCommunication from "./communication/PatientCommunication";
import PatientVitalSign from "./vitalSign/PatientVitalSign";
import PatientCompletedProcedures from "./completedProcedures/PatientCompletedProcedures";
import PatientPrescriptions from "./prescriptions/PatientPrescriptions";
import PatientLabOrders from "./labOrders/PatientLabOrders";
import PatientInvoices from "./invoices/PatientInvoices";
import PatientPayments from "./payments/PatientPayments";
import PatientLedgers from "./ledgers/PatientLedgers";
// import CreateAppointment from "./appointment/CreateAppointment"
const {Header, Content, Sider} = Layout;

class PatientHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPatient: null
        }
        this.setCurrentPatient = this.setCurrentPatient.bind(this);
    }


    setCurrentPatient(patientObj) {
        this.setState({
            currentPatient: patientObj
        });
    }


    render() {
        return <Content>
            <PatientHeader {...this.state} setCurrentPatient={this.setCurrentPatient}/>

            <Layout>
                <PatientSider {...this.state}/>
                <Layout>
                    <Content className="main-container"
                             style={{
                                 // margin: '24px 16px',
                                 // padding: 24,
                                 minHeight: 280,
                                 // marginLeft: '200px'
                             }}>
                        {/*** Patient Profile Routes*/}
                        <Route exact path='/patients/profile'
                               render={() =>
                                   (this.state.currentPatient ?
                                       <Redirect to={"/patient/" + this.state.currentPatient.id + "/profile"}/> :
                                       <PatientProfile {...this.state} setCurrentPatient={this.setCurrentPatient}/>)}/>
                        <Route exact path='/patients/profile/add'
                               render={() => <EditPatientDetails/>}/>
                        <Route exact path='/patient/:id/profile'
                               render={() => <PatientProfile {...this.state}
                                                             setCurrentPatient={this.setCurrentPatient}/>}/>
                        <Route exact path='/patient/:id/profile/edit'
                               render={() => <EditPatientDetails {...this.state} />}/>

                        {/*** Patient Appointment Routes*/}
                        <Route exact path='/patients/appointments'
                               render={() => (this.state.currentPatient ?
                                   <Redirect to={"/patient/" + this.state.currentPatient.id + "/appointments"}/> :
                                   <Appointment/>)}/>
                        <Route exact path='/patient/:id/appointments'
                               render={() => <Appointment/>}/>
                        {/*      <Route exact path='/patients/appointments/create'
                           render={() => <CreateAppointment {...this.props} />}/>*/}

                        {/*** Patient Communication Routes*/}
                        <Route exact path='/patients/communications'
                               render={() => (this.state.currentPatient ?
                                   <Redirect to={"/patient/" + this.state.currentPatient.id + "/communications"}/> :
                                   <PatientCommunication/>)}/>
                        <Route exact path='/patient/:id/communications'
                               render={() => <PatientCommunication/>}/>

                        {/*** Patient Vital Sign Routes*/}
                        <Route exact path='/patients/emr/vitalsigns'
                               render={() => (this.state.currentPatient ?
                                   <Redirect to={"/patient/" + this.state.currentPatient.id + "/emr/vitalsigns"}/> :
                                   <PatientVitalSign/>)}/>
                        <Route exact path='/patient/:id/emr/vitalsigns'
                               render={() => <PatientVitalSign/>}/>

                        {/*** Patient Clinic Notes Routes*/}
                        <Route path={"/patients/emr/clinicnotes"}
                               render={(route) => <PatientClinicNotes {...this.props} {...route}/>}/>
                        <Route path={"/patient/:id/emr/clinicnotes"}
                               render={(route) => <PatientClinicNotes {...this.state} {...this.props} {...route}/>}/>

                        {/*** Patient Completed Procedures Routes*/}
                        <Route exact path='/patients/emr/workdone'
                               render={() => (this.state.currentPatient ?
                                   <Redirect to={"/patient/" + this.state.currentPatient.id + "/emr/workdone"}/> :
                                   <PatientCompletedProcedures/>)}/>
                        <Route exact path='/patient/:id/emr/workdone'
                               render={() => <PatientCompletedProcedures/>}/>

                        {/*** Patient Files Routes*/}
                        <Route exact path='/patients/emr/files'
                               render={() => (this.state.currentPatient ?
                                   <Redirect to={"/patient/" + this.state.currentPatient.id + "/emr/files"}/> :
                                   <PatientFiles/>)}/>
                        <Route path={"/patient/:id/emr/files"} component={PatientFiles}/>

                        {/*** Patient Prescriptions Routes*/}
                        <Route exact path='/patients/emr/prescriptions'
                               render={() => (this.state.currentPatient ?
                                   <Redirect to={"/patient/" + this.state.currentPatient.id + "/emr/prescriptions"}/> :
                                   <PatientPrescriptions/>)}/>
                        <Route exact path='/patient/:id/emr/prescriptions'
                               render={() => <PatientPrescriptions/>}/>

                        {/*** Patient Timeline Routes*/}
                        <Route path={"/patient/:id/emr/timeline"} component={PatientTimeline}/>

                        {/*** Patient Lab Order Routes*/}
                        <Route path={"/patient/:id/emr/timeline"} component={PatientLabOrders}/>

                        {/*** Patient Invoices Routes*/}
                        <Route exact path='/patients/billing/invoices'
                               render={() => (this.state.currentPatient ?
                                   <Redirect to={"/patient/" + this.state.currentPatient.id + "/billing/invoices"}/> :
                                   <PatientInvoices/>)}/>
                        <Route exact path='/patient/:id/billing/invoices'
                               render={() => <PatientInvoices/>}/>

                        {/*** Patient Payments Routes*/}
                        <Route exact path='/patients/billing/payments'
                               render={() => (this.state.currentPatient ?
                                   <Redirect to={"/patient/" + this.state.currentPatient.id + "/billing/payments"}/> :
                                   <PatientPayments/>)}/>
                        <Route exact path='/patient/:id/billing/payments'
                               render={() => <PatientPayments/>}/>

                        {/*** Patient Ledger Routes*/}
                        <Route exact path='/patient/:id/billing/ledger'
                               render={() => <PatientLedgers/>}/>
                    </Content>
                </Layout>
            </Layout>
        </Content>
    }
}

export default PatientHome;
