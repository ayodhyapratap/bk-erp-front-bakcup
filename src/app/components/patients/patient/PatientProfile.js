import React from "react";
import PatientSelection from "../PatientSelection";
import {Avatar, Button, Card, Col, Divider, Icon, List, Row, Popconfirm, Modal, Statistic, Tag} from "antd";
import {Link, Redirect} from "react-router-dom";
import {getAPI, postAPI, interpolate, displayMessage, makeFileURL} from "../../../utils/common";
import {MEDICAL_MEMBERSHIP_CANCEL_API, PATIENTS_MEMBERSHIP_API, PATIENT_PROFILE} from "../../../constants/api";
import PatientNotes from "./PatientNotes";
import MedicalMembership from "./MedicalMembership";
import {SUCCESS_MSG_TYPE, ERROR_MSG_TYPE} from "../../../constants/dataKeys";
import {hideEmail, hideMobile} from "../../../utils/permissionUtils";
import AddOrEditAgent from "./AddOrEditAgent";
import {hashCode, intToRGB} from "../../../utils/clinicUtils";
import moment from "moment";

class PatientProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patientProfile: null,
            currentPatient: this.props.currentPatient,
            medicalHistory: {},
            loading: true,
            add: '',
            MedicalMembership: null,
            hide: false,
            agentModalVisible: false,
        };
        this.loadProfile = this.loadProfile.bind(this);
        this.loadMedicalMembership = this.loadMedicalMembership.bind(this);
    }

    componentDidMount() {
        if (this.state.currentPatient) {
            this.loadProfile(false);
            this.loadMedicalMembership();
        }
    }

    formChange = (value) => {
        this.setState({
            add: value,
        });
    }

    componentWillReceiveProps(newProps) {
        let that = this;
        if (newProps.currentPatient && newProps.currentPatient != this.state.currentPatient) {

            this.setState({
                currentPatient: newProps.currentPatient,
            }, function () {
                that.loadProfile(false);
            })
        }
    }

    loadProfile(refreshHeader = true) {
        let that = this;
        let successFn = function (data) {
            that.setState({
                patientProfile: data,
                loading: false
            });
            if (that.props.refreshWallet && refreshHeader) {
                that.props.refreshWallet();
            }
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        if (that.state.currentPatient)
            getAPI(interpolate(PATIENT_PROFILE, [that.state.currentPatient.id]), successFn, errorFn);
    }

    loadMedicalMembership() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                MedicalMembership: data[data.length - 1],
                loading: false
            })
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        getAPI(interpolate(PATIENTS_MEMBERSHIP_API, [that.props.currentPatient.id]), successFn, errorFn);

    }

    onClickHandler(value) {
        let that = this;
        if (this.state.MedicalMembership) {
            displayMessage(ERROR_MSG_TYPE, "Membership !!");
            that.setState({
                add: false
            })
        } else {
            this.setState({
                add: value
            });
        }

    }

    deleteMembership(id) {
        let that = this;
        let reqData = {
            id: id,
            is_active: false
        }
        let successFn = function (data) {
            that.loadProfile();
            that.loadMedicalMembership();
            if (that.props.refreshWallet) {
                that.props.refreshWallet();
            }
        }
        let errorFn = function () {

        };
        postAPI(interpolate(MEDICAL_MEMBERSHIP_CANCEL_API, [that.props.currentPatient.id]), reqData, successFn, errorFn);
    }

    addAgent = () => {
        let that = this;
        that.setState({
            agentModalVisible: true,
        });
    }
    addAgentModalClosed = () => {
        this.setState({
            agentModalVisible: false
        })
    }

    render() {
        let that = this;
        if (this.props.currentPatient) {
            let patient = this.state.patientProfile;
            if (!patient)
                return <Card loading={this.state.loading}/>;
            return <Card loading={this.state.loading} title="Patient Profile"
                         extra={<>
                             {/*{that.props.activePracticePermissions.SettingsAgents ?*/}
                             {/*    <Button type={"primary"} onClick={this.addAgent}><Icon type={"usergroup-add"}/>&nbsp;Add Agent</Button>:null} &nbsp;&nbsp;*/}
                             {that.props.activePracticePermissions.EditPatient ?
                                 <Link to={"/patient/" + this.state.currentPatient.id + "/profile/edit"}>
                                     <Button type="primary">
                                         <Icon type="edit"/>&nbsp;Edit Patient Profile</Button>
                                 </Link> : null}

                         </>}


            >
                <Row gutter={16}>
                    <Col span={6} style={{textAlign: 'center'}}>
                        {(patient.image ? <img src={makeFileURL(patient.image)} style={{width: '100%'}}/> :
                            <Avatar size={200} shape="square" style={{backgroundColor: '#87d068'}}>
                                {patient.user.first_name ? patient.user.first_name :
                                    <Icon type="user"/>}
                            </Avatar>)}

                        {patient.is_agent && patient.is_approved ? <Statistic title={"Referral Code"}
                                                                              value={patient.user.referer_code}/> : null}
                        <Col>
                            <Divider/>

                            {this.state.add ? <div><h1 style={{fontSize: '18px'}}>Medical Membership <a href="#"
                                                                                                        onClick={() => this.onClickHandler(false)}>Cancel</a>
                                </h1>
                                    <MedicalMembership {...this.props} {...this.state} patientId={patient.id}
                                                       loadMedicalMembership={that.loadMedicalMembership}
                                                       formChange={that.formChange} loadProfile={that.loadProfile}/></div>
                                : <div style={{padding: '0px'}}><h1
                                    style={{fontSize: '18px', textAlign: 'center'}}>Medical Membership <a href="#"
                                                                                                          onClick={() => this.onClickHandler(true)}>{this.state.MedicalMembership ? 'Renew' : 'Add'}</a>
                                </h1>
                                    {this.state.MedicalMembership ? <Card size="small" title={"Membership"}
                                                                          extra={<Popconfirm
                                                                              title="Are you sure delete this Membership?"
                                                                              onConfirm={() => that.deleteMembership(this.state.MedicalMembership.id)}
                                                                              okText="Yes" cancelText="No">
                                                                              <Button icon={"close"} type={"danger"}
                                                                                      shape="circle"
                                                                                      size="small"/>
                                                                          </Popconfirm>} style={{textAlign: "center"}}>
                                            <div style={{textAlign: "left"}}>
                                                <p><strong>Membership Code : </strong>
                                                    <span>{this.state.MedicalMembership.membership_code}</span></p>
                                                <p><strong>Start Date : </strong>
                                                    <span>{this.state.MedicalMembership.medical_from}</span></p>
                                                <p><strong>Valid Till : </strong>
                                                    <span>{this.state.MedicalMembership.medical_to}</span></p>
                                            </div>
                                        </Card>
                                        : null}
                                </div>
                            }
                        </Col>
                    </Col>

                    <Col span={12}>
                        <PatientRow label="Patient Name" value={patient.user.first_name}/>
                        <PatientRow label="Patient ID" value={patient.custom_id ? patient.custom_id : patient.id}/>
                        {patient && patient.role ?
                            <PatientRow label={"Advisor Role"} value={patient.role_data.name}/> : null}
                        <PatientRow label="Gender" value={patient.gender}/>
                        {patient.is_age ?
                            <PatientRow label="Age"
                                        value={patient.dob ? moment().diff(this.props.currentPatient.dob, 'years') : null}/>
                            :
                            <PatientRow label="Date of Birth" value={patient.dob}/>
                        }
                        <PatientRow label="On Dialysis?" value={patient.on_dialysis?"Yes":"No"}/>
                        <PatientRow label="Referer"
                                    value={patient.user.referer_data.referer ? <Link
                                        to={"/patient/" + patient.user.referer_data.patient + "/profile"}>{patient.user.referer_data.referer.first_name}</Link> : "--"}/>
                        <Divider>Contact Details</Divider>
                        <PatientRow label="Email"
                                    value={that.props.activePracticePermissions.PatientEmailId ? patient.user.email : hideEmail(patient.user.email)}/>
                        <PatientRow label="Primary Mobile"
                                    value={that.props.activePracticePermissions.PatientPhoneNumber ? patient.user.mobile : hideMobile(patient.user.mobile)}/>
                        <PatientRow label="Secondary Mobile"
                                    value={that.props.activePracticePermissions.PatientPhoneNumber ? patient.secondary_mobile_no : hideMobile(patient.secondary_mobile_no)}/>
                        <PatientRow label="Landline No" value={patient.landline_no}/>
                        <PatientRow label="Address" value={patient.address}/>
                        <PatientRow label="Locality" value={patient.locality}/>
                        <PatientRow label="City" value={patient.city_data ? patient.city_data.name : null}/>
                        <PatientRow label="State" value={patient.state_data ? patient.state_data.name : null}/>
                        <PatientRow label="Country" value={patient.country_data ? patient.country_data.name : null}/>
                        <PatientRow label="Pincode" value={patient.pincode}/>
                    </Col>
                    <Col span={6} style={{borderLeft: '1 px solid #ccc'}}>
                        <PatientNotes {...this.props} patientId={patient.id}/>
                        <Divider>Medical History</Divider>
                        {patient.medical_history_data ?
                            patient.medical_history_data.map((item, index) =>
                                <Tag color={'#' + intToRGB(hashCode(item.name))}>{item.name}</Tag>) : null}
                        {/*<List size="small" loading={this.state.loading} dataSource={patient.medical_history_data}*/}
                        {/*      renderItem={(item) =>*/}
                        {/*          <List.Item>{item.name}</List.Item>}/>}*/}

                        <Divider>Groups</Divider>
                        <List dataSource={patient.patient_group_data}
                              renderItem={(item) => <List.Item>{item.name}</List.Item>}/>
                        {/* <Divider>Medical Membership</Divider>
                        <List dataSource={patient.medical_membership}
                              renderItem={(item) => <List.Item>{item}</List.Item>}/> */}
                    </Col>

                    <Modal
                        title="Add Agent"
                        visible={this.state.agentModalVisible}
                        onOk={null}
                        footer={null}
                        onCancel={this.addAgentModalClosed}>
                        <AddOrEditAgent patientId={patient.id} {...this.state}/>
                    </Modal>
                </Row>

            </Card>;
        }
        return <PatientSelection {...this.props}/>
    }
}

export default PatientProfile;

function PatientRow(props) {
    return <Row gutter={16} style={{marginBottom: '5px'}}>
        <Col span={8} style={{textAlign: 'right'}}>{props.label}:</Col>
        <Col span={16}><strong>{props.value}</strong></Col>
    </Row>
}
