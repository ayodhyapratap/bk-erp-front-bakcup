import React from "react";
import {Avatar, Input, Card, Col, Icon, Radio, Row, Button, Spin, Modal, Tag, Select,Form} from "antd";
import {getAPI, interpolate, makeFileURL, postAPI} from "../../utils/common";
import {PATIENT_GROUPS, SEARCH_PATIENT, PATIENTS_LIST} from "../../constants/api";
import InfiniteFeedLoaderButton from "../common/InfiniteFeedLoaderButton";
import PatientGroups from "./patientGroups/PatientGroups";
import {hideEmail, hideMobile} from "../../utils/permissionUtils";
import {ADVANCED_SEARCH, BLOOD_GROUPS} from "../../constants/hardData";
import {ALL, CHOOSE} from "../../constants/dataKeys";

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
            });
        };
        let errorFn = function () {
            that.setState({})

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
                loading: false,
                advancedOptionShow: true,
            })
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })

        };
        getAPI(PATIENTS_LIST, successFn, errorFn);
    }

    searchPatient(value) {

            let that = this;
            that.setState({
               searchvalue:true,
            });
            let successFn = function (data) {
                    that.setState(function (prevState) {
                        if (data.current > 1) {
                            return {
                                patientListData: [...prevState.patientListData, ...data.results],
                                morePatients: data.next,
                                currentPage: data.current,
                            }
                        }else {
                            return {
                                patientListData: [...data.results],
                                morePatients: data.next,
                                currentPage: data.current,
                                loading: false
                            }
                        }
                    })

            };
            let errorFn = function () {

            };
            if (value){
                getAPI(interpolate(SEARCH_PATIENT, [value]), successFn, errorFn);
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
            if (patientGroup == 'smart_a' || patientGroup == 'smart_b' || patientGroup == 'smart_c' || patientGroup == 'smart_d'|| patientGroup == 'smart_e'|| patientGroup == 'smart_f') {
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
                        params.type = 'gt';
                        break;
                    case 'smart_d':
                        params.gender = 'female';
                        params.age = 30;
                        params.type = 'lt';
                        break;
                    case 'smart_e':
                        params.gender = 'male';
                        params.age = 30;
                        params.type = 'gt';
                        break;
                    case 'smart_f':
                        params.gender = 'male';
                        params.age = 30;
                        params.type = 'lt';
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
    };
    advancedOption(value){
        this.setState({
            advancedOptionShow:!value,
        })
    }
    addNewOptionField =()=>{
        let id = 0;
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        const nextKeys = keys.concat(id++);
        form.setFieldsValue({
            keys: nextKeys,
        });

    };
    // removeNewOptionField = (k) => {
    //     const { form } = this.props;
    //     const keys = form.getFieldValue('keys');
    //     if (keys.length === 1) {
    //         return;
    //     }
    //     form.setFieldsValue({
    //         keys: keys.filter(key => key !== k),
    //     });
    // };

    handleChangeOption = (type,value) => {
        let that = this;
        this.setState({
            [type]: value,
        })
    };

    render() {
        let that = this;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: [] });
        const keys = getFieldValue('keys');

        const formItems = keys.map((k, index) => (<span>
                <br/>
                 <Select style={{minWidth: '200px'}} defaultValue={CHOOSE}
                         onChange={(value)=>this.handleChangeOption('type',value)}>
                        <Select.Option value={''}>{CHOOSE}</Select.Option>
                     {ADVANCED_SEARCH.map((item) => <Select.Option value={item.value}>
                         {item.label}</Select.Option>)}
                </Select>

            {this.state.type?<span>
                    <Input placeholder="field" style={{ width: '60%', marginRight: 8 }} />
                    {/*<Icon*/}
                    {/*    className="dynamic-delete-button"*/}
                    {/*    type="minus-circle-o"*/}
                    {/*    onClick={()=>this.removeNewOptionField(k)}*/}
                    {/*/>&nbsp;&nbsp;*/}
                     <Icon
                         className="dynamic-delete-button"
                         type="plus-circle-o"
                         onClick={this.addNewOptionField}
                     />
            </span>
            :null}

            </span>));

        return <Row gutter={16}>
            <Col span={5}
                 style={{
                     height: 'calc(100% - 55px)',
                     overflow: 'auto',
                     padding: '10px',
                     // backgroundColor: '#e3e5e6',
                     // borderRight: '1px solid #ccc'
                 }}>
                <Radio.Group buttonStyle="solid" defaultValue={this.state.selectedPatientGroup}
                             onChange={this.changeSelectedPatientGroup}>
                    <h2>Patients</h2>
                    <Radio.Button key={'all'} style={{width: '100%', backgroundColor: 'transparent', border: '0px'}}
                                  value="all">
                        All Patients
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
                        key={group.id}
                        style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} value={group.id}>
                        {group.name}
                        <Tag color="#87d068" style={{float: 'right', margin: 4}}>
                            {group.patient_count}
                        </Tag>
                    </Radio.Button>)}
                    <p><br/></p>
                    <p><b>Smart Groups</b></p>
                    <Radio.Button
                        style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} key={"smart_a"}
                        value={"smart_a"}>
                        All Male
                    </Radio.Button>
                    <Radio.Button
                        style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} key={"smart_b"}
                        value={"smart_b"}>
                        All Female
                    </Radio.Button>
                    <Radio.Button
                        style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} key={"smart_e"}
                        value={"smart_e"}>
                        Male Over 30
                    </Radio.Button>
                    <Radio.Button
                        style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} key={"smart_c"}
                        value={"smart_c"}>
                        Female Over 30
                    </Radio.Button>
                    <Radio.Button
                        style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} key={"smart_f"}
                        value={"smart_f"}>
                        Male Under 30
                    </Radio.Button>
                    <Radio.Button
                        style={{width: '100%', backgroundColor: 'transparent', border: '0px'}} key={"smart_d"}
                        value={"smart_d"}>
                        Female Under 30
                    </Radio.Button>
                    <p><br/></p>
                </Radio.Group>
            </Col>
            <Col span={19} style={{overflow: 'scroll', borderLeft: '1px solid #ccc'}}>
                <Row>
                    {this.state.advancedOptionShow?<>
                        <Col span={12} >
                            <Search placeholder="Search Patient By Name / ID / Mobile No / Aadhar No"
                                    onChange={value => this.searchPatient(value.target.value)}
                                    enterButton/>
                        </Col>

                        <Col span={12} style={{textAlign:"center"}}>
                        <Button  icon="search" onClick={(value)=>this.advancedOption(true)}>Advance Search</Button>
                        </Col>


                        </>:<>

                             <Select style={{minWidth: '200px'}} defaultValue={CHOOSE}
                                    onChange={(value)=>this.handleChangeOption('type',value)}>
                                  <Select.Option value={''}>{CHOOSE}</Select.Option>
                                {ADVANCED_SEARCH.map((item) => <Select.Option value={item.value}>
                                    {item.label}</Select.Option>)}
                            </Select>
                            {this.state.type?<span>
                                    <Input placeholder="passenger name" style={{ width: '60%', marginRight: 8 }} />
                                    <Icon
                                        className="dynamic-delete-button"
                                        type="plus-circle-o"
                                        onClick={this.addNewOptionField}
                                    />
                            </span>
                            :null}

                            {formItems}
                        &nbsp;&nbsp;
                        <Button onChange={value => this.searchPatient(value.target.value)}>Search</Button>
                        &nbsp;&nbsp;
                        <a  icon="search" onClick={(value)=>this.advancedOption(false)}>Basic Search</a>
                    </>}
                </Row>

                <Spin spinning={this.state.loading}>
                    <Row>
                        {this.state.patientListData.length ?
                            this.state.patientListData.map((patient) => <PatientCard {...patient}
                                                                                     key={patient.id}
                                                                                     showMobile={that.props.activePracticePermissions.PatientPhoneNumber}
                                                                                     showEmail={that.props.activePracticePermissions.PatientEmailId}
                                                                                     setCurrentPatient={that.props.setCurrentPatient}/>) :
                            <p style={{textAlign: 'center'}}>No Data Found</p>
                        }
                    </Row>
                </Spin>
                {this.state.searchvalue ?  <InfiniteFeedLoaderButton loaderFunction={this.searchPatient}
                                                                     loading={this.state.loading}
                                                                     hidden={!this.state.morePatients}/> :

                    <InfiniteFeedLoaderButton loaderFunction={this.getMorePatient}
                                              loading={this.state.loading}
                                              hidden={!this.state.morePatients}/>
                }
            </Col>

            {/*<Col span={19} style={{overflow: 'scroll', borderLeft: '1px solid #ccc'}}>*/}
            {/*    <Search placeholder="Search Patient By Name / ID / Mobile No / Aadhar No"*/}
            {/*            onChange={value => this.searchPatient(value.target.value)}*/}
            {/*            enterButton/>*/}

            {/*    <Spin spinning={this.state.loading}>*/}
            {/*        <Row>*/}
            {/*            {this.state.patientListData.length ?*/}
            {/*                this.state.patientListData.map((patient) => <PatientCard {...patient}*/}
            {/*                                                                         key={patient.id}*/}
            {/*                                                                         showMobile={that.props.activePracticePermissions.PatientPhoneNumber}*/}
            {/*                                                                         showEmail={that.props.activePracticePermissions.PatientEmailId}*/}
            {/*                                                                         setCurrentPatient={that.props.setCurrentPatient}/>) :*/}
            {/*                <p style={{textAlign: 'center'}}>No Data Found</p>*/}
            {/*            }*/}
            {/*        </Row>*/}
            {/*    </Spin>*/}
            {/*    {this.state.searchvalue ?  <InfiniteFeedLoaderButton loaderFunction={this.searchPatient}*/}
            {/*                                                         loading={this.state.loading}*/}
            {/*                                                         hidden={!this.state.morePatients}/> :*/}

            {/*        <InfiniteFeedLoaderButton loaderFunction={this.getMorePatient}*/}
            {/*                                  loading={this.state.loading}*/}
            {/*                                  hidden={!this.state.morePatients}/>*/}
            {/*    }*/}

            {/*</Col>*/}
            <Modal visible={this.state.showPatientGroupModal}
                   footer={null}
                   onCancel={() => this.togglePatientGroupEditing(false)}>
                <PatientGroups {...this.props}/>
            </Modal>
        </Row>
    }
}

export default Form.create()(PatientSelection);

function PatientCard(patient) {
    return <Col xs={24} sm={24} md={12} lg={8} xl={8} xxl={6}>
        <Card onClick={() => patient.setCurrentPatient(patient)} style={{margin: '5px', height: 120}}>
            <Meta avatar={(patient.image ? <Avatar src={makeFileURL(patient.image)} size={50}/> :
                <Avatar style={{backgroundColor: '#87d068'}} size={50}>
                    {patient.user.first_name ? patient.user.first_name.charAt(0) :
                        <Icon type="user"/>}
                </Avatar>)}
                  title={patient.user.first_name}
                  description={
                      <span>{patient.showMobile ? patient.user.mobile : hideMobile(patient.user.mobile)}<br/>{patient.showEmail ? patient.user.email : hideEmail(patient.user.email)} <br/>
                          <span className={"patientIdHighlight"}>#
                              {patient.custom_id?patient.custom_id:patient.id}
                              {patient.gender?","+patient.gender.charAt(0).toUpperCase():null}
                          </span>

                      </span>}/>
        </Card>
    </Col>;
}
