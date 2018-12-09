import React from "react";
import PatientSelection from "../PatientSelection";
import {Button, Card, Col, Icon, Row} from "antd";
import {Link} from "react-router-dom";

class PatientProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        if (this.props.currentPatient) {
            let patient = this.props.currentPatient;
            return <Card>
                <Row>
                    <Col span={6}>
                        {/*<img src={} alt=""/>*/}
                    </Col>
                    <Col span={12}>
                        <PatientRow label="Patient Name" value={patient.name}/>
                        <PatientRow label="Patient ID" value={patient.patient_id}/>
                        <PatientRow label="Gender" value={patient.gender}/>
                        <PatientRow label="Age" value={patient.age}/>
                        <PatientRow label="Date of Birth" value={patient.dob}/>
                        <h2>Contact Details</h2>
                        <PatientRow label="Email" value={patient.email}/>
                        <PatientRow label="Primary Mobile" value={patient.primary_mobile_no}/>
                        <PatientRow label="Secondary Mobile" value={patient.secondary_mobile_no}/>
                        <PatientRow label="Landline No" value={patient.landline_no}/>
                        <PatientRow label="Address" value={patient.address}/>
                        <PatientRow label="Locality" value={patient.locality}/>
                        <PatientRow label="City" value={patient.city}/>
                        <PatientRow label="Pincode" value={patient.pincode}/>
                    </Col>
                    <Col span={6}>
                        <Link to="/patients/profile/edit">
                            <Button type="primary">
                                <Icon type="edit"/>&nbsp;Edit Patient Profile</Button>
                        </Link>
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
