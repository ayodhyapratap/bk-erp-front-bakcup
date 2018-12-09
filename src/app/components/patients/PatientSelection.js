import React from "react";
import {Avatar, Card, Col, Icon, Row} from "antd";
import {getAPI} from "../../utils/common";
import {PATIENTS_LIST} from "../../constants/api";

const {Meta} = Card;

class PatientSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            patientListData: []
        }
        this.getPatientListData = this.getPatientListData.bind(this);
    }

    componentDidMount() {
        this.getPatientListData();
    }

    getPatientListData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                patientListData: data
            })
        };
        let errorFn = function () {

        };
        getAPI(PATIENTS_LIST, successFn, errorFn);
    }

    render() {
        let that = this;
        return <Row>
            <Col
                span={8}
                style={{
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: 53,
                    backgroundColor: '#ccc'
                }}>
            </Col>

            <Col span={16} style={{overflow: 'scroll'}}>

                {this.state.patientListData.length ?
                    this.state.patientListData.map((patient) => <PatientCard {...patient}
                                                                             setCurrentPatient={that.props.setCurrentPatient}/>) :
                    <p style={{textAlign: 'center'}}>No Data Found</p>
                }
            </Col>
        </Row>
    }
}

export default PatientSelection;

function PatientCard(patient) {
    return <Col span={12}>
        <Card onClick={() => patient.setCurrentPatient(patient)}>
            <Meta
                avatar={(patient.image ? <Avatar src={patient.image}/> :
                    <Avatar style={{backgroundColor: '#87d068'}}>
                        {patient.name ? patient.name.charAt(0) :
                            <Icon type="user"/>}
                    </Avatar>)}
                title={patient.name}
                description="This is the description"/>
        </Card>
    </Col>;
}
