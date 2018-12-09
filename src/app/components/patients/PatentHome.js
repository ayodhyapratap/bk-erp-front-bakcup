import React from "react";
import PatientHeader from "./PatientHeader";
import {Layout} from "antd";
import {getAPI, deleteAPI, interpolate} from "../../utils/common";
import {ALL_PATIENTS} from "../../constants/api";


const {Header, Content, Sider} = Layout;

class PatientHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPatient: null
        }
        this.setCurrentPatient = this.setCurrentPatient.bind(this);
        this.loadPatients = this.loadPatients.bind(this);
    }
    componentDidMount(){
    this.loadPatients();
    }

    loadPatients(){
      let that = this;
      let successFn = function (data){
        console.log(data);
      }
      let errorFn = function () {

      }
      getAPI(ALL_PATIENTS, successFn, errorFn);
    }

    setCurrentPatient(patientObj) {
        this.setState({
            currentPatient:patientObj
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

                </Content>
            </Layout>
        </Layout>
    }
}

export default PatientHome;
