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
import PatientTreatmentPlans from "./treatmentPlans/PatientTreatmentPlans";
import PatientLabOrders from "./labOrders/PatientLabOrders";
import PatientInvoices from "./invoices/PatientInvoices";
import PatientPayments from "./payments/PatientPayments";
import PatientLedgers from "./ledgers/PatientLedgers";
import {Switch} from "react-router-dom";

const {Content} = Layout;

class PatientHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPatient: null,
            active_practiceId: this.props.active_practiceId,
            medicalHistory: [],
            listModalVisible: false
        };
        this.setCurrentPatient = this.setCurrentPatient.bind(this);
        this.togglePatientListModal = this.togglePatientListModal.bind(this);
    }


    setCurrentPatient(patientObj) {
        this.setState({
            currentPatient: patientObj,
            listModalVisible: false
        });
    }

    togglePatientListModal(option) {
        this.setState({
            listModalVisible: !!option
        });
    }

    render() {
        return <Content>
            <PatientHeader {...this.state} togglePatientListModal={this.togglePatientListModal}
                           setCurrentPatient={this.setCurrentPatient}/>

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
                                                           key={this.state.currentPatient}
                                                           setCurrentPatient={this.setCurrentPatient} {...this.props}/>)}/>
                            <Route exact path='/patients/profile/add'
                                   render={() => <EditPatientDetails key={this.state.currentPatient}/>}/>
                            <Route exact path='/patient/:id/profile'
                                   render={() => <PatientProfile {...this.state}
                                                                 key={this.state.currentPatient}
                                                                 setCurrentPatient={this.setCurrentPatient} {...this.props}/>}/>
                            <Route exact path='/patient/:id/profile/edit'
                                   render={() => <EditPatientDetails
                                       key={this.state.currentPatient}{...this.state} />}/>

                            {/*** Patient Appointment Routes*/}
                            <Route exact path='/patients/appointments'
                                   render={(route) => (this.state.currentPatient ?
                                       <Redirect to={"/patient/" + this.state.currentPatient.id + "/appointments"}/> :
                                       <Appointment  key={this.state.currentPatient} {...this.state} {...route}/>)}/>
                            <Route exact path='/patient/:id/appointments'
                                   render={(route) => <Appointment  key={this.state.currentPatient} {...this.state} {...route}/>}/>
                            <Route exact path='/patients/appointments/:appointmentid'
                                   render={(route) => <Appointment  key={this.state.currentPatient} {...this.state} {...route}/>}/>
                            {/*      <Route exact path='/patients/appointments/create'
                           render={() => <CreateAppointment {...this.props} />}/>*/}

                            {/*** Patient Communication Routes*/}
                            {/*<Route exact path='/patients/communications'*/}
                            {/*render={() => (this.state.currentPatient ?*/}
                            {/*<Redirect to={"/patient/" + this.state.currentPatient.id + "/communications"}/> :*/}
                            {/*<PatientCommunication/>)}/>*/}
                            <Route exact path='/patient/:id/communications'
                                   render={(route) => <PatientCommunication key={this.state.currentPatient} {...this.state} {...route}/>}/>

                            {/*** Patient Vital Sign Routes*/}
                            <Route exact path='/patients/emr/vitalsigns'
                                   render={(route) => (this.state.currentPatient ?
                                       <Redirect to={"/patient/" + this.state.currentPatient.id + "/emr/vitalsigns"}/> :
                                       <PatientVitalSign key={this.state.currentPatient} {...this.state} {...route}/>)}/>
                            <Route exact path='/patient/:id/emr/vitalsigns'
                                   render={(route) => <PatientVitalSign key={this.state.currentPatient} {...this.state} {...route} />}/>
                            <Route exact path='/patient/:id/emr/vitalsigns/add'
                                   render={(route) => <AddorEditPatientVitalSigns key={this.state.currentPatient} {...this.state} {...route}/>}/>
                            <Route exact path='/patient/:id/emr/vitalsigns/edit'
                                   render={(route) => <AddorEditPatientVitalSigns key={this.state.currentPatient} {...this.state} {...route}/>}/>

                            {/*** Patient Clinic Notes Routes*/}
                            <Route path={"/patients/emr/clinicnotes"}
                                   render={(route) => <PatientClinicNotes key={this.state.currentPatient} {...this.props} {...route}/>}/>
                            <Route path={"/patient/:id/emr/clinicnotes"}
                                   render={(route) =>
                                       <PatientClinicNotes key={this.state.currentPatient} {...this.state} {...this.props} {...route}/>}/>

                            {/*** Patient Completed Procedures Routes*/}
                            <Route exact path='/patients/emr/workdone'
                                   render={(route) => (this.state.currentPatient ?
                                       <Redirect to={"/patient/" + this.state.currentPatient.id + "/emr/workdone"}/> :
                                       <PatientCompletedProcedures key={this.state.currentPatient} {...this.state} {...route} />)}/>
                            <Route exact path='/patient/:id/emr/workdone'
                                   render={(route) => <PatientCompletedProcedures key={this.state.currentPatient} {...this.state} {...route}/>}/>

                            {/*** Patient Files Routes*/}
                            <Route exact path='/patients/emr/files'
                                   render={(route) => (this.state.currentPatient ?
                                       <Redirect to={"/patient/" + this.state.currentPatient.id + "/emr/files"}/> :
                                       <PatientFiles key={this.state.currentPatient} {...route} {...this.state}/>)}/>
                            <Route path={"/patient/:id/emr/files"}
                                   render={(route) => <PatientFiles key={this.state.currentPatient} {...route} {...this.state}/>}/>

                            {/*** Patient Prescriptions Routes*/}
                            <Route exact path='/patients/emr/prescriptions'
                                   render={(route) => (this.state.currentPatient ?
                                       <Redirect
                                           to={"/patient/" + this.state.currentPatient.id + "/emr/prescriptions"}/> :
                                       <PatientPrescriptions   key={this.state.currentPatient} {...this.state} {...route}/>)}/>
                            <Route path='/patient/:id/emr/prescriptions'
                                   render={(route) => <PatientPrescriptions key={this.state.currentPatient} {...this.state} {...route} />}/>

                            {/*** Patient Treatment Plan Routes*/}
                            <Route exact path='/patients/emr/plans'
                                   render={(route) => (this.state.currentPatient ?
                                       <Redirect to={"/patient/" + this.state.currentPatient.id + "/emr/plans"}/> :
                                       <PatientTreatmentPlans   key={this.state.currentPatient} {...this.state} {...route}/>)}/>
                            <Route path='/patient/:id/emr/plans'
                                   render={(route) => <PatientTreatmentPlans key={this.state.currentPatient} {...this.state} {...route} />}/>

                            {/*** Patient Timeline Routes*/}
                            <Route path={"/patient/:id/emr/timeline"} component={PatientTimeline}/>

                            {/*** Patient Lab Order Routes*/}
                            <Route path={"/patient/:id/emr/labtrackings"} component={PatientLabOrders}/>

                            {/*** Patient Invoices Routes*/}
                            <Route exact path='/patients/billing/invoices'
                                   render={(route) => (this.state.currentPatient ?
                                       <Redirect
                                           to={"/patient/" + this.state.currentPatient.id + "/billing/invoices"}/> :
                                       <PatientInvoices key={this.state.currentPatient} {...this.state} {...route}/>)}/>
                            <Route path='/patient/:id/billing/invoices'
                                   render={(route) => <PatientInvoices key={this.state.currentPatient} {...this.state} {...route}/>}/>

                            {/*** Patient Payments Routes*/}
                            <Route path='/patients/billing/payments'
                                   render={(route) => (this.state.currentPatient ?
                                       <Redirect
                                           to={"/patient/" + this.state.currentPatient.id + "/billing/payments"}/> :
                                       <PatientPayments key={this.state.currentPatient} {...this.state} {...route}/>)}/>
                            <Route path='/patient/:id/billing/payments'
                                   render={(route) => <PatientPayments key={this.state.currentPatient} {...this.state} {...route}/>}/>

                            {/*** Patient Ledger Routes*/}
                            <Route exact path='/patient/:id/billing/ledger'
                                   render={() => <PatientLedgers key={this.state.currentPatient}/>}/>
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        </Content>
    }
}

export default PatientHome;
