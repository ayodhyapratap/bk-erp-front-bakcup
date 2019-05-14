import React from "react";

import {Layout, Spin} from "antd";
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
import PrescriptionTemplate from "./prescriptions/PrescriptionTemplate";
import {displayMessage, getAPI, interpolate} from "../../utils/common";
import {PATIENT_PROFILE, PATIENTS_LIST} from "../../constants/api";
import {ERROR_MSG_TYPE} from "../../constants/dataKeys";
import PatientMerge from "./merge/PatientMerge";

const {Content} = Layout;

class PatientHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPatient: null,
            active_practiceId: this.props.active_practiceId,
            medicalHistory: [],
            listModalVisible: false,
            loading: false
        };
        this.setCurrentPatient = this.setCurrentPatient.bind(this);
        this.togglePatientListModal = this.togglePatientListModal.bind(this);
    }

    componentDidMount() {
        if (this.props.match.params.id && (!this.state.currentPatient || this.props.match.params.id != this.state.currentPatient.id)) {
            this.getPatientListData(this.props.match.params.id);
        }
    }

    getPatientListData(id) {
        let that = this;
        that.setState({
            loading: true
        });
        let successFn = function (data) {
            that.setCurrentPatient(data)
            // that.setState({
            //     patientListData: data.results,
            //     morePatients: data.next,
            //     currentPage: data.current,
            //     loading: false
            // })
        };
        let errorFn = function () {
            displayMessage(ERROR_MSG_TYPE, "Patient Loading Failed");
            that.setState({
                loading: false
            })

        };
        getAPI(interpolate(PATIENT_PROFILE, [id]), successFn, errorFn);
    }

    setCurrentPatient(patientObj) {
        console.log(patientObj);
        // var re1 = '(\\/)';	// Any Single Character 1
        // var re2 = '(p)';	// Any Single Character 2
        // var re3 = '(a)';	// Any Single Character 3
        // var re4 = '(t)';	// Any Single Character 4
        // var re5 = '(i)';	// Any Single Character 5
        // var re6 = '(e)';	// Any Single Character 6
        // var re7 = '(n)';	// Any Single Character 7
        // var re8 = '(t)';	// Any Single Character 8
        // var re9 = '(\\/)';	// Any Single Character 9
        // var re10 = '(\\d+)';	// Integer Number 1
        // var re11 = '(\\/)';	// Any Single Character 10
        // var re12 = '((?:[a-z][a-z]*[\\/]*))';	// Word 1
        // var re1P = '(\\/)';	// Any Single Character 1
        // var re2P = '(p)';	// Any Single Character 2
        // var re3P = '(a)';	// Any Single Character 3
        // var re4P = '(t)';	// Any Single Character 4
        // var re5P = '(i)';	// Any Single Character 5
        // var re6P = '(e)';	// Any Single Character 6
        // var re7P = '(n)';	// Any Single Character 7
        // var re8P = '(t)';	// Any Single Character 8
        // var re9P = '(s)';	// Any Single Character 9
        // var re10P = '(\\/)';	// Any Single Character 10
        // var re11P = '((?:[a-z][a-z]*[\\/]*))';	// Word 1
        //
        // var AllPatientsRegex = new RegExp(re1P + re2P + re3P + re4P + re5P + re6P + re7P + re8P + re9P + re10P + re11P, ["i"]);
        // var patientRegex = new RegExp(re1 + re2 + re3 + re4 + re5 + re6 + re7 + re8 + re9 + re10 + re11 + re12, ["i"]);
        let urlArray = this.props.location.pathname.split("/");
        if(!isNaN(parseInt(urlArray[2]))){
            if(patientObj) {
                urlArray[1] = "patient";
                urlArray[2] = patientObj.id;
            }
            else {
                urlArray[1] = "patients";
                urlArray.splice(2, 1);
            }
        }else{
            if(patientObj) {
                urlArray[1] = "patient";
                urlArray.splice(2,0,patientObj.id);
            }
        }
        this.props.history.push(urlArray.join("/"));
        console.log(urlArray);
        if (patientObj) {
            // var m = patientRegex.exec(this.props.location.pathname);
            // var mAll = AllPatientsRegex.exec(this.props.location.pathname);
            // if (m != null) {
            //     console.log("Found this",m);
            //     var c1 = m[1];
            //     var c2 = m[2];
            //     var c3 = m[3];
            //     var c4 = m[4];
            //     var c5 = m[5];
            //     var c6 = m[6];
            //     var c7 = m[7];
            //     var c8 = m[8];
            //     var c9 = m[9];
            //     var int1 = m[10];
            //     var c10 = m[11];
            //     var word1 = m[12];
            //     this.props.history.push(c1.replace(/</, "&lt;") + c2.replace(/</, "&lt;") + c3.replace(/</, "&lt;") + c4.replace(/</, "&lt;") + c5.replace(/</, "&lt;") + c6.replace(/</, "&lt;") + c7.replace(/</, "&lt;") + c8.replace(/</, "&lt;") + c9.replace(/</, "&lt;") + patientObj.id + c10.replace(/</, "&lt;") + word1.replace(/</, "&lt;"));
            // } else if (mAll != null) {
            //     var c1 = mAll[1];
            //     var c2 = mAll[2];
            //     var c3 = mAll[3];
            //     var c4 = mAll[4];
            //     var c5 = mAll[5];
            //     var c6 = mAll[6];
            //     var c7 = mAll[7];
            //     var c8 = mAll[8];
            //     var c9 = mAll[9];
            //     var c10 = mAll[10];
            //     var word1 = mAll[11];
            //     this.props.history.push(c1.replace(/</, "&lt;") + c2.replace(/</, "&lt;") + c3.replace(/</, "&lt;") + c4.replace(/</, "&lt;") + c5.replace(/</, "&lt;") + c6.replace(/</, "&lt;") + c7.replace(/</, "&lt;") + c8.replace(/</, "&lt;") + c10.replace(/</, "&lt;") + patientObj.id + c10.replace(/</, "&lt;") + word1.replace(/</, "&lt;"));
            //
            // }
        } else {
            // this.props.history.push("patients/")
        }
        this.setState({
            currentPatient: patientObj,
            loading: false,
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
            <Spin spinning={this.state.loading} size={"large"}>
                <PatientHeader {...this.state} togglePatientListModal={this.togglePatientListModal}
                               setCurrentPatient={this.setCurrentPatient}/>

                <Layout>
                    <PatientSider {...this.state}/>
                    <Layout>
                        <Content className="main-container"
                                 style={{
                                     // margin: '24px 16px',
                                     padding: 10,
                                     minHeight: 280,
                                     // marginLeft: '200px'
                                 }}>
                            <Switch>
                                {/*** Patient Profile Routes*/}
                                <Route exact path={"/patients/merge"} render={(route)=><PatientMerge {...this.state}/>}/>
                                <Route exact path='/patients/profile'
                                       render={(route) =>
                                           (this.state.currentPatient ?
                                               <Redirect
                                                   to={"/patient/" + this.state.currentPatient.id + "/profile"}/> :
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
                                           <Redirect
                                               to={"/patient/" + this.state.currentPatient.id + "/appointments"}/> :
                                           <Appointment key={this.state.currentPatient} {...this.state} {...route}/>)}/>
                                <Route exact path='/patient/:id/appointments'
                                       render={(route) => <Appointment
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>}/>
                                <Route exact path='/patients/appointments/:appointmentid'
                                       render={(route) => <Appointment
                                           key={this.state.currentPatient} {...this.state} {...route}/>}/>
                                {/*      <Route exact path='/patients/appointments/create'
                           render={() => <CreateAppointment {...this.props} />}/>*/}

                                {/*** Patient Communication Routes*/}
                                {/*<Route exact path='/patients/communications'*/}
                                {/*render={() => (this.state.currentPatient ?*/}
                                {/*<Redirect to={"/patient/" + this.state.currentPatient.id + "/communications"}/> :*/}
                                {/*<PatientCommunication/>)}/>*/}
                                <Route exact path='/patient/:id/communications'
                                       render={(route) => <PatientCommunication
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>}/>

                                {/*** Patient Vital Sign Routes*/}
                                <Route exact path='/patients/emr/vitalsigns'
                                       render={(route) => (this.state.currentPatient ?
                                           <Redirect
                                               to={"/patient/" + this.state.currentPatient.id + "/emr/vitalsigns"}/> :
                                           <PatientVitalSign
                                               key={this.state.currentPatient} {...this.state} {...route}/>)}/>
                                <Route exact path='/patient/:id/emr/vitalsigns'
                                       render={(route) => <PatientVitalSign
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route} />}/>
                                <Route exact path='/patient/:id/emr/vitalsigns/add'
                                       render={(route) => <AddorEditPatientVitalSigns
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>}/>
                                <Route exact path='/patient/:id/emr/vitalsigns/edit'
                                       render={(route) => <AddorEditPatientVitalSigns
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>}/>

                                {/*** Patient Clinic Notes Routes*/}
                                <Route path={"/patients/emr/clinicnotes"}
                                       render={(route) => <PatientClinicNotes
                                           key={this.state.currentPatient} {...this.props} {...route}/>}/>
                                <Route path={"/patient/:id/emr/clinicnotes"}
                                       render={(route) =>
                                           <PatientClinicNotes
                                               key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>}/>

                                {/*** Patient Completed Procedures Routes*/}
                                <Route exact path='/patients/emr/workdone'
                                       render={(route) => (this.state.currentPatient ?
                                           <Redirect
                                               to={"/patient/" + this.state.currentPatient.id + "/emr/workdone"}/> :
                                           <PatientCompletedProcedures
                                               key={this.state.currentPatient} {...this.state} {...route} />)}/>
                                <Route exact path='/patient/:id/emr/workdone'
                                       render={(route) => <PatientCompletedProcedures
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>}/>

                                {/*** Patient Files Routes*/}
                                <Route exact path='/patients/emr/files'
                                       render={(route) => (this.state.currentPatient ?
                                           <Redirect to={"/patient/" + this.state.currentPatient.id + "/emr/files"}/> :
                                           <PatientFiles
                                               key={this.state.currentPatient} {...route} {...this.state}/>)}/>
                                <Route path={"/patient/:id/emr/files"}
                                       render={(route) => <PatientFiles
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...route} {...this.state}/>}/>

                                {/*** Patient Prescriptions Routes*/}
                                <Route exact path='/patients/emr/prescriptions'
                                       render={(route) => (this.state.currentPatient ?
                                           <Redirect
                                               to={"/patient/" + this.state.currentPatient.id + "/emr/prescriptions"}/> :
                                           <PatientPrescriptions
                                               key={this.state.currentPatient} {...this.state} {...route}/>)}/>
                                <Route path='/patient/:id/emr/prescriptions'
                                       render={(route) => <PatientPrescriptions
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route} />}/>

                                {/*** Patient Treatment Plan Routes*/}
                                <Route exact path='/patients/emr/plans'
                                       render={(route) => (this.state.currentPatient ?
                                           <Redirect to={"/patient/" + this.state.currentPatient.id + "/emr/plans"}/> :
                                           <PatientTreatmentPlans
                                               key={this.state.currentPatient} {...this.state} {...route}/>)}/>
                                <Route path='/patient/:id/emr/plans'
                                       render={(route) => <PatientTreatmentPlans
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route} />}/>

                                {/*** Patient Timeline Routes*/}
                                <Route path={"/patient/:id/emr/timeline"} component={PatientTimeline}/>

                                {/*** Patient Lab Order Routes*/}
                                <Route exact path='/patient/emr/labtrackings'
                                       render={(route) => (this.state.currentPatient ?
                                               <Redirect
                                                   to={"/patient/" + this.state.currentPatient.id + "/emr/labtrackings"}/> :
                                               <PatientLabOrders
                                                   key={this.state.currentPatient} {...this.state} {...route}/>
                                       )}/>

                                <Route path='/patient/:id/emr/labtrackings'
                                       render={(route) => <PatientLabOrders
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route} />}/>

                                {/*** Patient Invoices Routes*/}
                                <Route exact path='/patients/billing/invoices'
                                       render={(route) => (this.state.currentPatient ?
                                           <Redirect
                                               to={"/patient/" + this.state.currentPatient.id + "/billing/invoices"}/> :
                                           <PatientInvoices
                                               key={this.state.currentPatient} {...this.props} {...this.state} {...route}/>)}/>
                                <Route path='/patient/:id/billing/invoices'
                                       render={(route) => <PatientInvoices
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>}/>

                                {/*** Patient Payments Routes*/}
                                <Route path='/patients/billing/payments'
                                       render={(route) => (this.state.currentPatient ?
                                           <Redirect
                                               to={"/patient/" + this.state.currentPatient.id + "/billing/payments"}/> :
                                           <PatientPayments
                                               key={this.state.currentPatient} {...this.state} {...route}/>)}/>
                                <Route path='/patient/:id/billing/payments'
                                       render={(route) => <PatientPayments
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>}/>

                                {/*** Patient Ledger Routes*/}
                                <Route exact path='/patient/:id/billing/ledger'
                                       render={() => <PatientLedgers
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null}/>}/>

                                <Route exact path='/patient/:id/prescriptions/template/add'
                                       render={(route) => <PrescriptionTemplate
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>}/>
                            </Switch>
                        </Content>
                    </Layout>
                </Layout>
            </Spin>
        </Content>
    }
}

export default PatientHome;
