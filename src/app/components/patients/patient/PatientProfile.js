import React from "react";
import PatientSelection from "../PatientSelection";
import {Avatar, Button, Card, Col, Divider, Icon, List, Row} from "antd";
import {Link} from "react-router-dom";
import {getAPI, interpolate} from "../../../utils/common";
import {MEDICAL_HISTORY, PATIENT_PROFILE} from "../../../constants/api";

class PatientProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patientProfile: null,
            currentPatient: this.props.currentPatient,
            medicalHistory: {},
            loading:true
        };
        this.loadProfile = this.loadProfile.bind(this);
        this.getMedicalHistory = this.getMedicalHistory.bind(this);
    }

    componentDidMount() {
        if (this.state.currentPatient) {
            this.loadProfile();

        }
        this.getMedicalHistory();
    }

    getMedicalHistory() {
        let that = this;
        let successFn = function (data) {
            let medicalHistoryData = {};
            data.forEach(function (history) {
                medicalHistoryData[history.id] = history
            });
            that.setState({
                medicalHistory: medicalHistoryData,
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(MEDICAL_HISTORY, [that.props.active_practiceId]), successFn, errorFn);
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (newProps.currentPatient && newProps.currentPatient != this.state.currentPatient) {

            this.setState({
                currentPatient: newProps.currentPatient,
            }, function () {
                that.loadProfile();
            })
        }
    }

    loadProfile() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                patientProfile: data,
                loading:false
            });
        };
        let errorFn = function () {
            that.setState({
                loading:false
            })
        };
        if (that.state.currentPatient)
            getAPI(interpolate(PATIENT_PROFILE, [that.state.currentPatient.id]), successFn, errorFn);
    }

    render() {
        let that = this;
        if (this.props.currentPatient) {
            let patient = this.state.patientProfile;
            if (!patient)
                return <Card loading={true}/>;
            return <Card title="Patient Profile"
                         extra={<Link to={"/patient/" + this.state.currentPatient.id + "/profile/edit"}>
                             <Button type="primary">
                                 <Icon type="edit"/>&nbsp;Edit Patient Profile</Button>
                         </Link>}>
                <Row gutter={16}>
                    <Col span={6} style={{textAlign: 'center'}}>
                        {(patient.image ? <img src={patient.image} style={{width: '100%'}}/> :
                            <Avatar size={200} shape="square" style={{backgroundColor: '#87d068'}}>
                                {patient.user.first_name ? patient.user.first_name :
                                    <Icon type="user"/>}
                            </Avatar>)}
                    </Col>
                    <Col span={12}>
                        <PatientRow label="Patient Name" value={patient.user.first_name}/>
                        <PatientRow label="Patient ID" value={patient.id}/>
                        <PatientRow label="Gender" value={patient.gender}/>
                        <PatientRow label="Age" value={patient.age}/>
                        <PatientRow label="Date of Birth" value={patient.dob}/>
                        <Divider>Contact Details</Divider>
                        <PatientRow label="Email" value={patient.email}/>
                        <PatientRow label="Primary Mobile" value={patient.user.mobile}/>
                        <PatientRow label="Secondary Mobile" value={patient.secondary_mobile_no}/>
                        <PatientRow label="Landline No" value={patient.landline_no}/>
                        <PatientRow label="Address" value={patient.address}/>
                        <PatientRow label="Locality" value={patient.locality}/>
                        <PatientRow label="City" value={patient.city}/>
                        <PatientRow label="Pincode" value={patient.pincode}/>
                    </Col>
                    <Col span={6} style={{borderLeft: '1 px solid #ccc'}}>
                        <Divider>Medical History</Divider>
                        {this.state.medicalHistory && <List dataSource={patient.medical_history}
                                                                    renderItem={(item) =>
                                                                        <List.Item>{this.state.medicalHistory[item].name}</List.Item>}/>}

                        <Divider>Groups</Divider>
                        <List dataSource={patient.patient_group}
                              renderItem={(item) => <List.Item>{item}</List.Item>}/>
                        <Divider>Medical Membership</Divider>
                        <List dataSource={patient.medical_membership}
                              renderItem={(item) => <List.Item>{item}</List.Item>}/>
                    </Col>
                </Row>
            </Card>;
        }
        return <PatientSelection {...this.props}/>
    }
}

export default PatientProfile;

function PatientRow(props) {
    return <Row gutter={16} style={{marginBottom: '5px'}}>
        <Col span={12} style={{textAlign: 'right'}}>{props.label}:</Col>
        <Col span={12}><strong>{props.value}</strong></Col>
    </Row>
}
