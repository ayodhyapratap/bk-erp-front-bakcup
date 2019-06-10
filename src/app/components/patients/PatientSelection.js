import React from "react";
import {Avatar, Input, Card, Col, Icon, Radio, Row, Button, Spin, Modal, Tag} from "antd";
import {getAPI, interpolate, postAPI} from "../../utils/common";
import {PATIENT_GROUPS, SEARCH_PATIENT, PATIENTS_LIST} from "../../constants/api";
import InfiniteFeedLoaderButton from "../common/InfiniteFeedLoaderButton";
import PatientGroups from "./patientGroups/PatientGroups";

const {Meta} = Card;
const Search = Input.Search;

class PatientSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patientListData: [],
            patientGroup: [],
            morePatients: null,
            loading: true,
            selectedPatientGroup: 'all'
        }
        this.getPatientListData = this.getPatientListData.bind(this);
        this.searchPatient = this.searchPatient.bind(this);
        this.getMorePatient = this.getMorePatient.bind(this);
    }

    componentDidMount() {
        this.getPatientListData();
        this.getPatientGroup();
    }

    getPatientGroup() {
        let that = this;
        let successFn = function (data) {
            let filteredData = data.sort(function (a, b) {
                return b.patient_count - a.patient_count
            })
            that.setState({
                patientGroup: filteredData,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })

        };
        getAPI(interpolate(PATIENT_GROUPS, [this.props.active_practiceId]), successFn, errorFn);
    }

    getPatientListData() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                patientListData: data.results,
                morePatients: data.next,
                currentPage: data.current,
                totalPatients: data.count,
                loading: false
            })
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })

        };
        getAPI(PATIENTS_LIST, successFn, errorFn);
    }

    searchPatient(e) {
        if (e.target.value) {
            let that = this;
            let successFn = function (data) {
                if (data) {
                    that.setState({
                        patientListData: data
                    })
                }
            };
            let errorFn = function () {

            };
            getAPI(interpolate(SEARCH_PATIENT, [e.target.value]), successFn, errorFn);
        } else {
            this.getPatientListData();
        }
    }

    getMorePatient() {
        let that = this;
        let current = this.state.currentPage;

        let successFn = function (data) {
            if (data.current == current + 1)
                that.setState(function (prevState) {
                    if (data.current > 1)
                        return {
                            patientListData: [...prevState.patientListData, ...data.results],
                            morePatients: data.next,
                            currentPage: data.current,
                        }
                    else
                        return {
                            patientListData: [...data.results],
                            morePatients: data.next,
                            currentPage: data.current,
                            loading: false
                        }
                })
        }
        let errorFn = function () {

        }
        let params = {};
        if (current) {
            params.page = parseInt(current) + 1;
        } else {
            this.setState({
                loading: true
            })
        }
        let patientGroup = this.state.selectedPatientGroup;
        if (patientGroup != 'all') {
            if (patientGroup == 'smart_a' || patientGroup == 'smart_b' || patientGroup == 'smart_c' || patientGroup == 'smart_d') {
                switch (patientGroup) {
                    case 'smart_a':
                        params.gender = 'male';
                        break;
                    case 'smart_b':
                        params.gender = 'female';
                        break;
                    case 'smart_c':
                        params.gender = 'female';
                        params.age = 30;
                        params.type = 'lt';
                        break;
                    case 'smart_d':
                        params.gender = 'female';
                        params.age = 30;
                        params.type = 'gt';
                        break;
                }
            } else {
                params.group = this.state.selectedPatientGroup
            }

        }
        getAPI(PATIENTS_LIST, successFn, errorFn, {...params});
    }

    togglePatientGroupEditing = (option) => {
        this.setState({
            showPatientGroupModal: !!option
        });
        if (!option) {
            this.getPatientGroup();
        }
    }

    changeSelectedPatientGroup = (e) => {
        let that = this;
        this.setState({
            selectedPatientGroup: e.target.value,
            currentPage: null
        }, function () {
            that.getMorePatient();
        })
    }

    render() {
        let that = this;
        return <Row>
            <Col span={5}
                 style={{
                     height: 'calc(100vh - 55px)',
                     overflow: 'auto',
                     padding: '10px',
                     // backgroundColor: '#e3e5e6',
                     borderRight: '1px solid #ccc'
                 }}>
                <Radio.Group buttonStyle="solid" defaultValue={this.state.selectedPatientGroup}
                             onChange={this.changeSelectedPatientGroup}>
                    <h2>Patients</h2>
                    <Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value="all">
                        All Patents
                        <Tag color="#87d068" style={{float: 'right', margin: 4}}>
                            {this.state.totalPatients ? this.state.totalPatients : 0}
                        </Tag>
                    </Radio.Button>
                    {/*<Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value="b">*/}
                    {/*Recently Visited*/}
                    {/*</Radio.Button>*/}
                    {/*<Radio.Button style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value="c">*/}
                    {/*Recently Added*/}
                    {/*</Radio.Button>*/}
                    <p><br/></p>
                    <h2>Groups</h2>
                    <p><b>My Groups</b>
                        <a style={{float: 'right'}}
                           onClick={() => this.togglePatientGroupEditing(true)}>Manage</a></p>
                    {this.state.patientGroup.map((group) => <Radio.Button
                        style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value={group.id}>
                        {group.name}
                        <Tag color="#87d068" style={{float: 'right', margin: 4}}>
                            {group.patient_count}
                        </Tag>
                    </Radio.Button>)}
                    {/*<p><br/></p>*/}
                    <p><b>Smart Groups</b></p>
                    <Radio.Button
                        style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value={"smart_a"}>
                        All Male Customers
                    </Radio.Button>
                    <Radio.Button
                        style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value={"smart_b"}>
                        All FeMale Customers
                    </Radio.Button>
                    <Radio.Button
                        style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value={"smart_c"}>
                        Female Customers Over 30
                    </Radio.Button>
                    <Radio.Button
                        style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value={"smart_d"}>
                        Female Customers Under 30
                    </Radio.Button>
                    <p><br/></p>
                </Radio.Group>
            </Col>
            <Col span={19} style={{overflow: 'scroll'}}>
                <Search placeholder="input search text"
                        onChange={value => this.searchPatient(value)}
                        enterButton/>
                <Spin spinning={this.state.loading}>
                    <Row>


                        {this.state.patientListData.length ?
                            this.state.patientListData.map((patient) => <PatientCard {...patient}
                                                                                     setCurrentPatient={that.props.setCurrentPatient}/>) :
                            <p style={{textAlign: 'center'}}>No Data Found</p>
                        }
                    </Row>
                </Spin>
                <InfiniteFeedLoaderButton loaderFunction={this.getMorePatient}
                                          loading={this.state.loading}
                                          hidden={!this.state.morePatients}/>

            </Col>
            <Modal visible={this.state.showPatientGroupModal}
                   footer={null}
                   onCancel={() => this.togglePatientGroupEditing(false)}>
                <PatientGroups {...this.props}/>
            </Modal>
        </Row>
    }
}

export default PatientSelection;

function PatientCard(patient) {
    return <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
        <Card onClick={() => patient.setCurrentPatient(patient)} style={{margin: '5px'}}>
            <Meta avatar={(patient.image ? <Avatar src={patient.image}/> :
                <Avatar style={{backgroundColor: '#87d068'}}>
                    {patient.user.first_name ? patient.user.first_name.charAt(0) :
                        <Icon type="user"/>}
                </Avatar>)}
                  title={patient.user.first_name}
                  description={<span>{patient.user.mobile}<br/>{patient.user.email}</span>}/>
        </Card>
    </Col>;
}
