import React from "react";
import {Avatar, Button, Card, Col, Divider, Drawer, Icon, Layout, Row, Tooltip} from "antd";
import {getAPI} from "../../utils/common";
import {PATIENTS_LIST} from "../../constants/api";

const {Header, Content, Sider} = Layout;
const {Meta} = Card;

class PatientHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listModalVisible: false,
            patientListData: []
        };
        this.togglePatientListModal = this.togglePatientListModal.bind(this);
        this.getPatientListData = this.getPatientListData.bind(this);
    }

    togglePatientListModal(option) {
        this.setState({
            listModalVisible: !!option
        });
        if (option) {
            this.getPatientListData();
        }
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
        return <Header className="header">
            <div>
                {this.props.currentPatient ?
                    <div style={{display: 'inline'}}>
                        <div style={{display: 'inline', textSize: '25px'}}>
                            <Tooltip title="Switch Back to All Patients">
                                <Button onClick={() => this.props.setCurrentPatient(null)}>
                                    <Icon type="solution"/> &nbsp;
                                    Back
                                </Button>
                            </Tooltip>
                        </div>
                        <a style={{color: 'white', padding: '8px', fontSize: '20px'}}
                           onClick={() => this.togglePatientListModal(true)}>
                            {(this.props.currentPatient.image ? <Avatar src={this.props.currentPatient.image}/> :
                                <Avatar style={{backgroundColor: '#87d068'}}>
                                    {this.props.currentPatient.name ? this.props.currentPatient.name.charAt(0) :
                                        <Icon type="user"/>}
                                </Avatar>)}
                            &nbsp;&nbsp;{that.props.currentPatient.name}
                        </a>
                    </div> :
                    <a style={{color: 'white', padding: '8px', fontSize: '20px'}}
                       onClick={() => this.togglePatientListModal(true)}>
                        <div style={{display: 'inline'}}><Icon type="solution"/> &nbsp; All Patient</div>
                    </a>}
            </div>
            <Drawer
                title="Select Patient"
                width={720}
                placement="left"
                onClose={() =>
                    this.togglePatientListModal(false)
                }
                maskClosable={false}
                visible={this.state.listModalVisible}
                style={{
                    height: 'calc(100% - 55px)',
                    overflow: 'auto',
                    paddingBottom: 53,
                }}>
                <Row>
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
                    <
                    /Row>
            </Drawer>
        </Header>
    }
    }

    export default PatientHeader;

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
