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
import {displayMessage, getAPI, getCommonSettings, interpolate, saveCommonSettings} from "../../utils/common";
import {PATIENT_PROFILE, PATIENTS_LIST} from "../../constants/api";
import {ERROR_MSG_TYPE} from "../../constants/dataKeys";
import PatientMerge from "./merge/PatientMerge";
import PatientRequiredNoticeCard from "./PatientRequiredNoticeCard";
import PatientMedicalCertificate from "./files/PatientMedicalCertificate";

const {Content} = Layout;

class PatientHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPatient: null,
            active_practiceId: this.props.active_practiceId,
            medicalHistory: [],
            listModalVisible: false,
            loading: false,
            showAllClinic: getCommonSettings('showAllClinic')
        };
        this.setCurrentPatient = this.setCurrentPatient.bind(this);
        this.togglePatientListModal = this.togglePatientListModal.bind(this);
        this.toggleShowAllClinic = this.toggleShowAllClinic.bind(this);
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

    setCurrentPatient(patientObj,redirectUrl=null) {
        let that = this;
        let urlArray = this.props.location.pathname.split("/");
        if (!isNaN(parseInt(urlArray[2]))) {
            if (patientObj) {
                urlArray[1] = "patient";
                urlArray[2] = patientObj.id;
            }
            else {
                urlArray[1] = "patients";
                urlArray.splice(2, 1);
            }
        } else {
            if (patientObj) {
                urlArray[1] = "patient";
                urlArray.splice(2, 0, patientObj.id);
            }
        }
        this.props.history.push(urlArray.join("/"));
        this.setState({
            currentPatient: patientObj,
            loading: false,
            listModalVisible: false
        },function(){
            if(redirectUrl)
                that.props.history.push(interpolate(redirectUrl,[patientObj.id]))
        });
    }

    togglePatientListModal(option) {
        this.setState({
            listModalVisible: !!option
        });
    }

    toggleShowAllClinic(option) {
        this.setState({
            showAllClinic: !!option
        }, function () {
            saveCommonSettings('showAllClinic', !!option)
        });
    }

    render() {
        return <Content>
            <Spin spinning={this.state.loading} size={"large"}>
                <PatientHeader {...this.state} togglePatientListModal={this.togglePatientListModal}
                               setCurrentPatient={this.setCurrentPatient}
                               toggleShowAllClinic={this.toggleShowAllClinic}/>

                <Layout>
                    <PatientSider {...this.state}/>
                    <Layout>
                        <Content className="main-container"
                                 key={this.state.showAllClinic.toString()}
                                 style={{
                                     // margin: '24px 16px',
                                     padding: 10,
                                     minHeight: 280,
                                     // marginLeft: '200px'
                                 }}>
                            <Switch>
                                {/*** Patient Profile Routes*/}
                                <Route exact path={"/patients/merge"}
                                       render={(route) => <PatientMerge {...this.state}/>}/>
                                <Route exact path='/patients/profile'
                                       render={(route) =>
                                           (this.state.currentPatient ?
                                               <Redirect
                                                   to={"/patient/" + this.state.currentPatient.id + "/profile"}/> :
                                               <PatientProfile {...this.state}
                                                               key={this.state.currentPatient}
                                                               setCurrentPatient={this.setCurrentPatient} {...this.props}/>)}/>
                                <Route exact path='/patients/profile/add'
                                       render={(route) => <EditPatientDetails
                                           key={this.state.currentPatient} {...this.props} {...route}/>}/>
                                <Route exact path='/patient/:id/profile'
                                       render={() => <PatientProfile {...this.state}
                                                                     key={this.state.currentPatient}
                                                                     setCurrentPatient={this.setCurrentPatient} {...this.props}/>}/>
                                <Route exact path='/patient/:id/profile/edit'
                                       render={(route) => <EditPatientDetails
                                           key={this.state.currentPatient}{...this.state}{...this.props} {...route}/>}/>

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
                                <Route exact path='/patients/communications'
                                       render={() => (this.state.currentPatient ?
                                           <Redirect
                                               to={"/patient/" + this.state.currentPatient.id + "/communications"}/> :
                                           <PatientRequiredNoticeCard
                                               togglePatientListModal={this.togglePatientListModal}/>)}/>
                                <Route exact path='/patient/:id/communications'
                                       render={(route) => <PatientCommunication
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>}/>

                                {/*** Patient Vital Sign Routes*/}
                                <Route exact path='/patients/emr/vitalsigns'
                                       render={(route) => (this.state.currentPatient ?
                                           <Redirect
                                               to={"/patient/" + this.state.currentPatient.id + "/emr/vitalsigns"}/> :
                                           <PatientVitalSign
                                               togglePatientListModal={this.togglePatientListModal}
                                               key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route} />)}/>
                                <Route path='/patient/:id/emr/vitalsigns'
                                       render={(route) => <PatientVitalSign
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route} />}/>

                                <Route exact path='/patient/:id/emr/vitalsigns/edit'
                                       render={(route) => <AddorEditPatientVitalSigns
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>}/>

                                {/*** Patient Clinic Notes Routes*/}
                                <Route path={"/patients/emr/clinicnotes"}
                                       render={(route) =>
                                           <PatientClinicNotes
                                               togglePatientListModal={this.togglePatientListModal}
                                               key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>}/>}/>
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
                                               togglePatientListModal={this.togglePatientListModal}
                                               key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>)}/>
                                <Route path='/patient/:id/emr/workdone'
                                       render={(route) => <PatientCompletedProcedures
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>}/>

                                {/*** Patient Files Routes*/}
                                <Route exact path='/patients/emr/files'
                                       render={(route) => (this.state.currentPatient ?
                                           <Redirect to={"/patient/" + this.state.currentPatient.id + "/emr/files"}/> :
                                           <PatientFiles
                                               togglePatientListModal={this.togglePatientListModal}
                                               key={this.state.currentPatient ? this.state.currentPatient.id : null} {...route} {...this.state}/>)}/>
                                <Route path={"/patient/:id/emr/files"}
                                       render={(route) => <PatientFiles
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...route} {...this.state}/>}/>
                                <Route path={"/patient/:id/emr/create-medicalCertificate"}
                                       render={(route) => <PatientMedicalCertificate

                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...route} {...this.state}/>}/>

                                {/*** Patient Prescriptions Routes*/}
                                <Route exact path='/patients/emr/prescriptions'
                                       render={(route) => (this.state.currentPatient ?
                                           <Redirect
                                               to={"/patient/" + this.state.currentPatient.id + "/emr/prescriptions"}/> :
                                           <PatientPrescriptions
                                               togglePatientListModal={this.togglePatientListModal}
                                               key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route} />)}/>
                                <Route path='/patient/:id/emr/prescriptions'
                                       render={(route) => <PatientPrescriptions
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route} />}/>

                                {/*** Patient Treatment Plan Routes*/}
                                <Route exact path='/patients/emr/plans'
                                       render={(route) => (this.state.currentPatient ?
                                           <Redirect to={"/patient/" + this.state.currentPatient.id + "/emr/plans"}/> :
                                           <PatientTreatmentPlans
                                               togglePatientListModal={this.togglePatientListModal}
                                               key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route} />)}/>
                                <Route path='/patient/:id/emr/plans'
                                       render={(route) => <PatientTreatmentPlans
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route} />}/>

                                {/*** Patient Timeline Routes*/}
                                <Route path={"/patient/:id/emr/timeline"} render={(route) => <PatientTimeline
                                    key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>}/>

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
                                               togglePatientListModal={this.togglePatientListModal}
                                               key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>)}/>
                                <Route path='/patient/:id/billing/invoices'
                                       render={(route) => <PatientInvoices
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>}/>

                                {/*** Patient Payments Routes*/}
                                <Route path='/patients/billing/payments'
                                       render={(route) => (this.state.currentPatient ?
                                           <Redirect
                                               to={"/patient/" + this.state.currentPatient.id + "/billing/payments"}/> :
                                               <PatientPayments
                                       key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>)}/>
                                <Route path='/patient/:id/billing/payments'
                                       render={(route) => <PatientPayments
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>}/>

                                {/*** Patient Ledger Routes*/}
                                <Route exact path='/patient/:id/billing/ledger'
                                       render={(route) => <PatientLedgers
                                           key={this.state.currentPatient ? this.state.currentPatient.id : null} {...this.state} {...route}/>}/>

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
