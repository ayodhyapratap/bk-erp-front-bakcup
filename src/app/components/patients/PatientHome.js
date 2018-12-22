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
import AddorEditPatientVitalSigns from "./vitalSign/AddorEditPatientVitalSigns";
import PatientCompletedProcedures from "./completedProcedures/PatientCompletedProcedures";
import PatientPrescriptions from "./prescriptions/PatientPrescriptions";
import AddorEditPatientPrescriptions from "./prescriptions/AddorEditPatientPrescriptions";
import PatientTreatmentPlans from "./treatmentPlans/PatientTreatmentPlans";
import PatientLabOrders from "./labOrders/PatientLabOrders";
import PatientInvoices from "./invoices/PatientInvoices";
import PatientPayments from "./payments/PatientPayments";
import PatientLedgers from "./ledgers/PatientLedgers";
import {Switch} from "react-router-dom";
import {MEDICAL_HISTORY, PATIENT_GROUPS} from "../../constants/api";
import {MEDICAL_HISTORY_KEY, PATIENT_GROUP_KEY} from "../../constants/dataKeys";
import {getAPI, interpolate} from "../../utils/common";
// import CreateAppointment from "./appointment/CreateAppointment"
const {Header, Content, Sider} = Layout;

class PatientHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPatient: null,
            active_practiceId: this.props.active_practiceId,
            medicalHistory : []
        };
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
                        <Switch>
                            {/*** Patient Profile Routes*/}
                            <Route exact path='/patients/profile'
                                   render={() =>
                                       (this.state.currentPatient ?
                                           <Redirect to={"/patient/" + this.state.currentPatient.id + "/profile"}/> :
                                           <PatientProfile {...this.state}
                                                           setCurrentPatient={this.setCurrentPatient} {...this.props}/>)}/>
                            <Route exact path='/patients/profile/add'
                                   render={() => <EditPatientDetails/>}/>
                            <Route exact path='/patient/:id/profile'
                                   render={() => <PatientProfile {...this.state}
                                                                 setCurrentPatient={this.setCurrentPatient} {...this.props}/>}/>
                            <Route exact path='/patient/:id/profile/edit'
                                   render={() => <EditPatientDetails {...this.state} />}/>

                            {/*** Patient Appointment Routes*/}
                            <Route exact path='/patients/appointments'
                                   render={(route) => (this.state.currentPatient ?
                                       <Redirect to={"/patient/" + this.state.currentPatient.id + "/appointments"}/> :
                                       <Appointment  {...this.state} {...route}/>)}/>
                            <Route exact path='/patient/:id/appointments'
                                   render={(route) => <Appointment  {...this.state} {...route}/>}/>
                            <Route exact path='/patients/appointments/:appointmentid'
                                   render={(route) => <Appointment  {...this.state} {...route}/>}/>
                            {/*      <Route exact path='/patients/appointments/create'
                           render={() => <CreateAppointment {...this.props} />}/>*/}

                        {/*** Patient Communication Routes*/}
                        {/*<Route exact path='/patients/communications'*/}
                               {/*render={() => (this.state.currentPatient ?*/}
                                   {/*<Redirect to={"/patient/" + this.state.currentPatient.id + "/communications"}/> :*/}
                                   {/*<PatientCommunication/>)}/>*/}
                        <Route exact path='/patient/:id/communications'
                               render={() => <PatientCommunication/>}/>

                        {/*** Patient Vital Sign Routes*/}
                        <Route exact path='/patients/emr/vitalsigns'
                               render={(route) => (this.state.currentPatient ?
                                   <Redirect to={"/patient/" + this.state.currentPatient.id + "/emr/vitalsigns"}/> :
                                   <PatientVitalSign {...this.state} {...route}/>)}/>
                        <Route exact path='/patient/:id/emr/vitalsigns'
                               render={(route) => <PatientVitalSign {...this.state}  {...route} />}/>
                         <Route exact path='/patient/:id/emr/vitalsigns/add'
                                render={(route) => <AddorEditPatientVitalSigns {...this.state} {...route}/>}/>
                         <Route exact path='/patient/:id/emr/vitalsigns/edit'
                                render={(route) => <AddorEditPatientVitalSigns {...this.state} {...route}/>}/>

                        {/*** Patient Clinic Notes Routes*/}
                        <Route path={"/patients/emr/clinicnotes"}
                               render={(route) => <PatientClinicNotes {...this.props} {...route}/>}/>
                        <Route path={"/patient/:id/emr/clinicnotes"}
                               render={(route) => <PatientClinicNotes {...this.state} {...this.props} {...route}/>}/>

                        {/*** Patient Completed Procedures Routes*/}
                        <Route exact path='/patients/emr/workdone'
                               render={(route) => (this.state.currentPatient ?
                                   <Redirect to={"/patient/" + this.state.currentPatient.id + "/emr/workdone"}/> :
                                   <PatientCompletedProcedures {...this.state} {...route} />)}/>
                        <Route exact path='/patient/:id/emr/workdone'
                               render={(route) => <PatientCompletedProcedures {...this.state} {...route}/>}/>

                        {/*** Patient Files Routes*/}
                        <Route exact path='/patients/emr/files'
                               render={() => (this.state.currentPatient ?
                                   <Redirect to={"/patient/" + this.state.currentPatient.id + "/emr/files"}/> :
                                   <PatientFiles/>)}/>
                        <Route path={"/patient/:id/emr/files"} component={PatientFiles}/>

                        {/*** Patient Prescriptions Routes*/}
                        <Route exact path='/patients/emr/prescriptions'
                               render={(route) => (this.state.currentPatient ?
                                   <Redirect to={"/patient/" + this.state.currentPatient.id + "/emr/prescriptions"}/> :
                                   <PatientPrescriptions   {...this.state} {...route}/>)}/>
                       <Route path='/patient/:id/emr/prescriptions'
                              render={(route) => <PatientPrescriptions {...this.state}  {...route} />}/>

                        {/*** Patient Treatment Plan Routes*/}
                        <Route exact path='/patients/emr/plans'
                               render={(route) => (this.state.currentPatient ?
                                   <Redirect to={"/patient/" + this.state.currentPatient.id + "/emr/plans"}/> :
                                   <PatientTreatmentPlans   {...this.state} {...route}/>)}/>
                       <Route path='/patient/:id/emr/plans'
                              render={(route) => <PatientTreatmentPlans {...this.state}  {...route} />}/>

                        {/*** Patient Timeline Routes*/}
                        <Route path={"/patient/:id/emr/timeline"} component={PatientTimeline}/>

                        {/*** Patient Lab Order Routes*/}
                        <Route path={"/patient/:id/emr/labtrackings"} component={PatientLabOrders}/>

                        {/*** Patient Invoices Routes*/}
                        <Route exact path='/patients/billing/invoices'
                               render={(route) => (this.state.currentPatient ?
                                   <Redirect to={"/patient/" + this.state.currentPatient.id + "/billing/invoices"}/> :
                                   <PatientInvoices {...this.state} {...route}/>)}/>
                        <Route  path='/patient/:id/billing/invoices'
                               render={(route) => <PatientInvoices {...this.state} {...route}/>}/>

                        {/*** Patient Payments Routes*/}
                        <Route  path='/patients/billing/payments'
                               render={(route) => (this.state.currentPatient ?
                                   <Redirect to={"/patient/" + this.state.currentPatient.id + "/billing/payments"}/> :
                                   <PatientPayments {...this.state} {...route}/>)}/>
                        <Route  path='/patient/:id/billing/payments'
                               render={(route) => <PatientPayments {...this.state} {...route}/>}/>

                        {/*** Patient Ledger Routes*/}
                        <Route exact path='/patient/:id/billing/ledger'
                               render={() => <PatientLedgers/>}/>
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        </Content>
    }
}

export default PatientHome;
