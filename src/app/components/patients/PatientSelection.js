import React from "react";
import {Avatar, Input, Card, Col, Icon, InputNumber,Radio, Row, Button, Spin, Modal, Tag,
    DatePicker,Select,Form} from "antd";
import {getAPI, interpolate, makeFileURL, postAPI} from "../../utils/common";
import {
    PATIENT_GROUPS,
    SEARCH_PATIENT,
    PATIENTS_LIST,
    ADVANCED_SEARCH_PATIENT, SOURCE
} from "../../constants/api";
import InfiniteFeedLoaderButton from "../common/InfiniteFeedLoaderButton";
import PatientGroups from "./patientGroups/PatientGroups";
import {hideEmail, hideMobile} from "../../utils/permissionUtils";
import {
    ADVANCED_SEARCH,
    BLOOD_GROUPS,
    HAS_AADHAR_ID,
    HAS_AGE,
    HAS_DOB,
    HAS_EMAIL,
    HAS_GENDER, HAS_PINCODE, HAS_STREET, REFERED_BY_AGENT
} from "../../constants/hardData";
import {CHOOSE, GENDER} from "../../constants/dataKeys";
import moment from "moment";

const {Meta} = Card;
const Search = Input.Search;
const { MonthPicker } = DatePicker;
let id=1;
class PatientSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            patientListData: [],
            patientGroup: [],
            morePatients: null,
            loading: true,
            selectedPatientGroup: 'all',
            advanced_option:ADVANCED_SEARCH,
            selectedOption:{},
            // keys:1,
            sourceList: [],
        };
        this.getPatientListData = this.getPatientListData.bind(this);
        this.searchPatient = this.searchPatient.bind(this);
        this.getMorePatient = this.getMorePatient.bind(this);
        this.getSources = this.getSources.bind(this);
    }

    componentDidMount() {
        this.getPatientListData();
        this.getPatientGroup();
        this.getSources();
    }

    getSources() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                sourceList: data,
            })
        };
        let errorFun = function () {

        };
        getAPI(SOURCE, successFn, errorFun);
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
                // advancedOptionShow: false,
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
        // console.log("value",value)
        let that=this;
        this.getPatientListData();
        this.setState({
            advancedOptionShow:!value,
            selectedOption:'',
        });
        if (value){
            that.props.form.setFieldsValue({
                keys: [0],
            });
        }

    }

    addNewOptionField =()=>{

        const { form } = this.props;

        const keys = form.getFieldValue('keys');
        // console.log("form",form,keys)
        const nextKeys = keys.concat(id++);
        form.setFieldsValue({
            keys: nextKeys,
        });
    };
    removeNewOptionField = (k) => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }

        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    handleChangeOption=(index,type,value)=>{
        let that = this;
        let selectedOption={};
       that.setState(function(prevState){
           return {
               selectedOption: {...prevState.selectedOption,[index]: value},
           }
       })
    };

    AdvanceSearchPatient=(e)=>{
        e.preventDefault();
        let that=this;
        let reqData={}
        this.props.form.validateFields((err, values) => {
            if (!err) {
                reqData = {...values,
                    dob:values.dob?moment(values.dob).format('YYYY-MM-DD'):null,
                    dob_gte:values.dob_gte?moment(values.dob_gte).format('YYYY-MM-DD'):null,
                    dob_lte:values.dob_lte?moment(values.dob_lte).format('YYYY-MM-DD'):null,
                    dob_month:values.dob_month?moment(values.dob_month).format('MM'):null,
                };


            }
        });
        delete reqData.keys;
        let successFn =function(data){
            that.setState({
                patientListData:data,
            })

        };
        let errorFn=function(){

        };
        getAPI(ADVANCED_SEARCH_PATIENT,successFn,errorFn,reqData)
    };
    render() {
        let that = this;
        const { getFieldDecorator,getFieldValue} = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 }
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 }
            }
        };
        getFieldDecorator('keys', { initialValue: [0] });
        const keys = getFieldValue('keys');
        const chooseOption = keys.map((k, index) => (<>
             <Col span={12}>
                <Select style={{minWidth: '200px'}} defaultValue={CHOOSE} key={k}
                         onChange={(value)=>this.handleChangeOption(k,'type',value)}>
                    <Select.Option value={''}>{CHOOSE}</Select.Option>
                    {this.state.advanced_option.map((item) => <Select.Option value={item.value} key={k}>
                        {item.label}</Select.Option>)}
                </Select>
             </Col>
                {this.state.selectedOption?
                    <Col span={10} style={{display:"flex"}}>
                        <FormItems k={k} selectedOption={this.state.selectedOption} form={this.props.form} sourceList={this.state.sourceList} />
                        {keys.length > 1 ?(
                            <Form.Item>
                                <Button shape="circle"  onClick={()=>this.removeNewOptionField(k)}>
                                    <Icon className="dynamic-delete-button" type="minus-circle-o"/>
                                </Button>
                                <br/>
                            </Form.Item>

                        ) : null}
                    </Col>:null
                }


        </>
        ));






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
                <Row gutter={16}>
                    {this.state.advancedOptionShow?
                        <Form onSubmit={this.AdvanceSearchPatient}>

                                {chooseOption}


                            <Col span={12} style={{display:'flex'}}>
                                <Form.Item>
                                    <Button shape="circle"  onClick={this.addNewOptionField}>
                                        <Icon className="dynamic-delete-button" type="plus-circle-o"/>
                                    </Button>
                                </Form.Item>

                                <Form.Item>
                                    <Button htmlType="submit" onSubmit={this.AdvanceSearchPatient}>Search</Button>
                                </Form.Item>

                                <Form.Item>
                                    <Button icon="search" onClick={(value) => this.advancedOption(true)}>Basic Search</Button>
                                </Form.Item>

                            </Col>
                        </Form>
                        :<>

                            <Col span={12}>
                                <Search placeholder="Search Patient By Name / ID / Mobile No / Aadhar No"
                                        onChange={value => this.searchPatient(value.target.value)}
                                        enterButton/>
                            </Col>
                            <Col span={12} style={{textAlign:"center"}}>
                                <Button  icon="search" onClick={(value)=>this.advancedOption(false)}>Advance Search</Button>
                            </Col>

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
        <Card onClick={() => patient.setCurrentPatient(patient)} style={{margin: '3px', paddingBottom:"8px"}}>
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
function FormItems(index) {
    return (
        <>
            {index.selectedOption[index.k]=='name'?
                <Form.Item key={index.key}>
                    {index.form.getFieldDecorator('name',)
                        (<Input placeholder={"patient Name"}/>)
                    }
                </Form.Item> : null}

            {index.selectedOption[index.k]=='phone'?
                <Form.Item key={index.key}>
                    {index.form.getFieldDecorator('phone',)
                    (<Input placeholder={"Contact Number"}/>)
                    }
                </Form.Item> : null}

            {index.selectedOption[index.k]=='age'?
                <Form.Item key={index.key}>
                    {index.form.getFieldDecorator('age',)
                    (<InputNumber placeholder={"Patient Age"}/>)
                    }
                </Form.Item> : null}

            {index.selectedOption[index.k]=='age_gte'?
                <Form.Item key={index.key}>
                    {index.form.getFieldDecorator('age_gte',)
                    (<InputNumber placeholder={"Age more than"}/>)
                    }
                </Form.Item> : null}

            {index.selectedOption[index.k]=='age_lte'?
                <Form.Item key={index.key}>
                    {index.form.getFieldDecorator('age_lte',)
                    (<InputNumber placeholder={"Age Less than"}/>)
                    }
                </Form.Item> : null}

            {index.selectedOption[index.k]=='has_age'?
                <Form.Item>
                    {index.form.getFieldDecorator('has_age')
                    (<Select style={{width:100}}>
                        {HAS_AGE.map((option)=><Select.Option value={option.value}>{option.label} </Select.Option>)}
                    </Select>)
                    }
                </Form.Item>
                : null}

            {index.selectedOption[index.k]=='dob'?
                <Form.Item key={index.key}>
                    {index.form.getFieldDecorator('dob',)
                    (<DatePicker placeholder={"Date of Birth"}/>)
                    }
                </Form.Item> : null}

            {index.selectedOption[index.k]=='dob_gte'?
                <Form.Item key={index.key}>
                    {index.form.getFieldDecorator('dob_gte',)
                    (<DatePicker/>)
                    }
                </Form.Item> : null}

            {index.selectedOption[index.k]=='dob_lte'?
                <Form.Item key={index.key}>
                    {index.form.getFieldDecorator('dob_lte',)
                    (<DatePicker/>)
                    }
                </Form.Item> : null}

            {index.selectedOption[index.k]=='dob_month'?
                <Form.Item key={index.key}>
                    {index.form.getFieldDecorator('dob_month',)
                    (<MonthPicker/>)
                    }
                </Form.Item> : null}

            {index.selectedOption[index.k]=='has_dob'?
                <Form.Item>
                    {index.form.getFieldDecorator('has_dob')
                    (<Select style={{width:100}}>
                        {HAS_DOB.map((option)=><Select.Option value={option.value}>{option.label} </Select.Option>)}
                    </Select>)
                    }
                </Form.Item>
                : null}

            {index.selectedOption[index.k]=='patient_id'?
                <Form.Item key={index.key}>
                    {index.form.getFieldDecorator('patient_id',)
                    (<Input placeholder={"Patient Id"}/>)
                    }
                </Form.Item> : null}

            {index.selectedOption[index.k]=='has_aadhar'?
                <Form.Item>
                    {index.form.getFieldDecorator('has_aadhar')
                    (<Select style={{width:100}}>
                        {HAS_AADHAR_ID.map((option)=><Select.Option value={option.value}>{option.label} </Select.Option>)}
                    </Select>)
                    }
                </Form.Item>
                : null}

            {index.selectedOption[index.k]=='aadhar'?
                <Form.Item key={index.key}>
                    {index.form.getFieldDecorator('aadhar',)
                    (<Input placeholder={"Aadhar Id"}/>)
                    }
                </Form.Item> : null}

            {index.selectedOption[index.k]=='email'?
                <Form.Item key={index.key}>
                    {index.form.getFieldDecorator('email',)
                    (<Input placeholder={"Email Id"}/>)
                    }
                </Form.Item> : null}

            {index.selectedOption[index.k]=='has_email'?
                <Form.Item>
                    {index.form.getFieldDecorator('has_email')
                    (<Select style={{width:100}}>
                        {HAS_EMAIL.map((option)=><Select.Option value={option.value}>{option.label} </Select.Option>)}
                    </Select>)
                    }
                </Form.Item>
                : null}

            {index.selectedOption[index.k]=='gender'?
                <Form.Item>
                    {index.form.getFieldDecorator('gender')
                    (<Select style={{width:100}}>
                        {GENDER.map((option)=><Select.Option value={option.value}>{option.label} </Select.Option>)}
                    </Select>)
                    }
                </Form.Item>
                : null}


            {index.selectedOption[index.k]=='has_gender'?
                <Form.Item>
                    {index.form.getFieldDecorator('has_gender')
                    (<Select style={{width:100}}>
                        {HAS_GENDER.map((option)=><Select.Option value={option.value}>{option.label} </Select.Option>)}
                    </Select>)
                    }
                </Form.Item>
                : null}

            {index.selectedOption[index.k]=='pincode'?
                <Form.Item key={index.key}>
                    {index.form.getFieldDecorator('pincode',)
                    (<Input placeholder={"PINCODE"}/>)
                    }
                </Form.Item> : null}

            {index.selectedOption[index.k]=='has_pincode'?
                <Form.Item>
                    {index.form.getFieldDecorator('has_pincode')
                    (<Select style={{width:100}}>
                        {HAS_PINCODE.map((option)=><Select.Option value={option.value}>{option.label} </Select.Option>)}
                    </Select>)
                    }
                </Form.Item>
                : null}

            {index.selectedOption[index.k]=='has_street'?
                <Form.Item>
                    {index.form.getFieldDecorator('has_street')
                    (<Select style={{width:100}}>
                        {HAS_STREET.map((option)=><Select.Option value={option.value}>{option.label} </Select.Option>)}
                    </Select>)
                    }
                </Form.Item>
                : null}


            {index.selectedOption[index.k]=='street'?
                <Form.Item key={index.key}>
                    {index.form.getFieldDecorator('street',)
                    (<Input placeholder={"Street Address"}/>)
                    }
                </Form.Item> : null}

            {index.selectedOption[index.k]=='blood_group'?
                <Form.Item>
                    {index.form.getFieldDecorator('blood_group')
                    (<Select style={{width:100}}>
                        {BLOOD_GROUPS.map((option)=><Select.Option value={option.value}>{option.name} </Select.Option>)}
                    </Select>)
                    }
                </Form.Item>
                : null}

            {index.selectedOption[index.k]=='source'?
                <Form.Item>
                    {index.form.getFieldDecorator('source')
                    (<Select style={{width:100}}>
                        {index.sourceList.map((option)=><Select.Option value={option.id}>{option.name} </Select.Option>)}
                    </Select>)
                    }
                </Form.Item>
                : null}

            {index.selectedOption[index.k]=='agent_referal'?
                <Form.Item>
                    {index.form.getFieldDecorator('agent_referal')
                    (<Select style={{width:100}}>
                        {REFERED_BY_AGENT.map((option)=><Select.Option value={option.value}>{option.label} </Select.Option>)}
                    </Select>)
                    }
                </Form.Item>
                : null}



        </>)
}