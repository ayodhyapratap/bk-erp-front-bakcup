import React from "react";
import PatientHeader from "./PatientHeader";
import {Layout} from "antd";
import {Route} from "react-router";
import PatientProfile from "./patient/PatientProfile";
import EditPatientDetails from "./patient/EditPatientDetails";

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
                             margin: '24px 16px',
                             padding: 24,
                             minHeight: 280,
                             // marginLeft: '200px'
                         }}>
                    <Route exact path='/patients/profile'
                           render={() => <PatientProfile {...this.state} setCurrentPatient={this.setCurrentPatient}/>}/>
                    <Route exact path='/patients/editprofile'
                            render={() => <EditPatientDetails {...this.state} />}/>


                </Content>
            </Layout>
        </Layout>
    }
}

export default PatientHome;
