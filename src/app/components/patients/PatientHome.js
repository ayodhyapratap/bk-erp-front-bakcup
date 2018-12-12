import React from "react";
import PatientHeader from "./PatientHeader";
import {Layout} from "antd";
import {Route} from "react-router";
import PatientProfile from "./patient/PatientProfile";
import EditPatientDetails from "./patient/EditPatientDetails";
import Appointment from "./appointment/Appointment"
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
        return <Layout>
            <PatientHeader {...this.state} setCurrentPatient={this.setCurrentPatient}/>
            <Layout>
                <Content className="main-container"
                         style={{
                             // margin: '24px 16px',
                             // padding: 24,
                             minHeight: 280,
                             // marginLeft: '200px'
                         }}>
                    <Route exact path='/patients/profile'
                           render={() => <PatientProfile {...this.state} setCurrentPatient={this.setCurrentPatient}/>}/>
                    <Route exact path='/patients/profile/edit'
                            render={() => <EditPatientDetails {...this.state} />}/>
                    <Route exact path='/patients/profile/add'
                            render={() => <EditPatientDetails/>}/>
                    <Route exact path='/patients/appointments'
                           render={() => <Appointment />}/>
              {/*      <Route exact path='/patients/appointments/create'
                           render={() => <CreateAppointment {...this.props} />}/>*/}

                </Content>
            </Layout>
        </Layout>
    }
}

export default PatientHome;
