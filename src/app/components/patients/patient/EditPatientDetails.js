import React from "react";
import {
    Button,
    Card,
    Checkbox,
    DatePicker,
    Form,
    Icon,
    Input,
    message,
    Modal,
    Select,
    Radio,
    Upload,
    InputNumber
} from "antd";
import {
    FILE_UPLOAD_API,
    FILE_UPLOAD_BASE64,
    MEDICAL_HISTORY,
    MEMBERSHIP_API,
    PATIENT_GROUPS,
    PATIENT_PROFILE,
    PATIENTS_LIST,
    COUNTRY,
    STATE,
    CITY, SOURCE,
} from "../../../constants/api";
import {
    displayMessage,
    getAPI,
    interpolate,
    makeFileURL,
    makeURL,
    postAPI,
    putAPI,
    removeEmpty
} from "../../../utils/common";
import moment from 'moment';
import {REQUIRED_FIELD_MESSAGE} from "../../../constants/messages";
import WebCamField from "../../common/WebCamField";
import {SUCCESS_MSG_TYPE, INPUT_FIELD, SELECT_FIELD, ALL} from "../../../constants/dataKeys";
import {Link} from "react-router-dom";
import {BLOOD_GROUPS, FAMILY_GROUPS, PATIENT_AGE, SOURCE_PLATFORM} from "../../../constants/hardData";

const {Option} = Select;


class EditPatientDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
            history: [],
            patientGroup: [],
            membership: [],
            webCamState: {},
            countrylist: [],
            stateList: [],
            cityList: [],
            sourceList: [],
            country: this.props.currentPatient && this.props.currentPatient.country_data ? this.props.currentPatient.country : null,
            state: this.props.currentPatient && this.props.currentPatient.state_data ? this.props.currentPatient.state : null,
            selectedFormType: 'DOB',
            file_count: 10,
            file_enable: true,
            // patientDetails:{},

        }
        this.changeRedirect = this.changeRedirect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getCountry = this.getCountry.bind(this);
        this.getState = this.getState.bind(this);
        this.getCity = this.getCity.bind(this);
        this.getSources = this.getSources.bind(this);
        this.loadPatientData = this.loadPatientData.bind(this);
    }

    componentDidMount() {
        this.loadMedicalHistory();
        this.getPatientGroup();
        this.getPatientMembership();
        this.getSources();
        this.getCountry();
        if (this.state.country) {
            this.getState();
        }
        if (this.state.state) {
            this.getCity();
        }
        if (this.props.currentPatient) {
            this.loadPatientData(this.props.currentPatient.id);
        }

    }

    getCountry() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                countrylist: data,
            })
        };
        let errorFun = function () {

        };
        getAPI(COUNTRY, successFn, errorFun);
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

    getState() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                stateList: data,
            })

        };
        let errorFn = function () {

        };
        getAPI(STATE, successFn, errorFn, {country: this.state.country});


    }

    getCity() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                cityList: data,
            })

        };
        let errorFn = function () {

        };
        getAPI(CITY, successFn, errorFn, {
            state: this.state.state,
        });

    }

    getPatientMembership() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                membership: data
            })
        }
        let errorFn = function () {

        }
        getAPI(interpolate(MEMBERSHIP_API, [this.props.active_practiceId]), successFn, errorFn);
    }

    loadMedicalHistory = () => {
        var that = this;
        let successFn = function (data) {
            that.setState({
                history: data,
            })
        };
        let errorFn = function () {

        };

        getAPI(interpolate(MEDICAL_HISTORY, [this.props.active_practiceId]), successFn, errorFn);

    };

    loadPatientData(patient) {

        let that = this;
        let successFn = function (data) {
            that.setState({
                patientDetails: data,
                loading: false
            })
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        getAPI(interpolate(PATIENT_PROFILE, [that.props.currentPatient.id]), successFn, errorFn);
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    setFormParams = (type, value) => {
        this.setState({
            [type]: value
        })
    }

    getPatientGroup = () => {
        let that = this;
        let successFn = function (data) {
            that.setState({
                patientGroup: data,
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
    handleSubmit = (e) => {
        let that = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let reqData = {
                    ...values,
                    file_enable: !!values.file_enable,
                    file_count: values.file_count ? values.file_count : this.state.file_count,
                    on_dialysis: that.state.on_dialysis ? true : false,
                    medical_history: values.medical_history,
                    patient_group: values.patient_group,
                    user: {
                        first_name: values.first_name ? values.first_name : '',
                        mobile: values.mobile,
                        email: values.email
                    },


                };
                if (values.anniversary) {
                    reqData.anniversary = moment(values.anniversary).format("YYYY-MM-DD");
                }

                if (values.dob) {
                    reqData.dob = moment(values.dob).format("YYYY-MM-DD");
                }
                if (values.age) {
                    reqData.is_age = true;
                    reqData.dob = moment().subtract(values.age, 'years').format("YYYY-MM-DD");
                }
                let key = 'image';
                if (reqData[key] && reqData[key].file && reqData[key].file.response)
                    reqData[key] = reqData[key].file.response.image_path;
                delete reqData.first_name;
                delete reqData.email;
                delete reqData.referer_code;
                delete reqData.mobile;
                delete reqData.age;
                that.setState({});
                let successFn = function (data) {
                    displayMessage("Patient Saved Successfully!!");
                    if (that.props.currentPatient)
                        that.props.history.push('/patient/' + that.props.currentPatient.id + '/profile')
                    else
                        that.props.history.push('/patients/profile')
                }
                let errorFn = function () {
                    that.setState({})
                }
                reqData = removeEmpty(reqData);
                if (that.props.currentPatient) {
                    putAPI(interpolate(PATIENT_PROFILE, [that.props.currentPatient.id]), reqData, successFn, errorFn);
                } else {
                    postAPI(interpolate(PATIENTS_LIST, [that.props.match.params.id]), reqData, successFn, errorFn);
                }
            }
        });
    }
    toggleWebCam = (type, value) => {
        this.setState(function (prevState) {
            return {
                webCamState: {...prevState.webCamState, [type]: value}
            }
        })
    }
    getImageandUpload = (fieldKey, image) => {
        let that = this;
        let reqData = new FormData();

        reqData.append('image', image);
        reqData.append('name', 'file');

        let successFn = function (data) {
            that.props.form.setFieldsValue({[fieldKey]: {file: {response: data}}});
            displayMessage(SUCCESS_MSG_TYPE, "Image Captured and processed.");
            that.setState(function (prevState) {
                return {
                    webCamState: {...prevState.webCamState, [fieldKey]: false}
                }
            })
        }
        let errorFn = function () {

        }
        postAPI(FILE_UPLOAD_BASE64, reqData, successFn, errorFn, {
            'content-type': 'multipart/form-data'
        });

    }
    onChangeValue = (type, value) => {
        let that = this;
        that.setState({
            [type]: value
        }, function () {
            if (type == 'country') {
                that.getState();
            }
            if (type == 'state') {
                that.getCity();
            }

        })

    }
    setFormParams = (type, value) => {
        this.setState({
            [type]: value
        })
    }
    onChangeCheckbox = (e) => {
        this.setState({
            on_dialysis: !this.state.on_dialysis,
        });
    };
    changeFormType = (e) => {
        this.setState({
            selectedFormType: e.target.value
        })

    };
    // onFileEnable=(e)=>{
    //     this.setState({
    //         file_enable:!this.state.file_enable,
    //     })
    // }
    render() {
        let that = this;
        console.log("sate", that.state)
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = ({
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        });
        const historyOption = []
        if (this.state.history) {
            this.state.history.forEach(function (historyItem) {
                historyOption.push({label: (historyItem.name), value: historyItem.id});
            })
        }
        const patientGroupOption = []
        if (this.state.patientGroup) {
            this.state.patientGroup.forEach(function (patientGroupItem) {
                patientGroupOption.push({label: (patientGroupItem.name), value: patientGroupItem.id});
            });
        }

        const membershipOption = []
        if (this.state.membership) {
            this.state.membership.forEach(function (membershipItem) {
                membershipOption.push({label: (membershipItem.name), value: membershipItem.id});
            });
        }
        const singleUploadprops = {
            name: 'image',
            data: {
                name: 'hello'
            },
            action: makeURL(FILE_UPLOAD_API),
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                    console.log(info.file, info.fileList);
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };
        return (
            <Form onSubmit={that.handleSubmit}>
                <Card title={<span>{that.props.currentPatient ? "Edit Profile" : "Add Patient"}&nbsp;&nbsp;<Link
                    to={"/patients/patientprintform"}>Print Patient Form</Link></span>}
                      extra={<div>
                          <Button style={{margin: 5}} type="primary" htmlType="submit">Submit</Button>
                          {that.props.history ?
                              <Button style={{margin: 5}} onClick={() => that.props.history.goBack()}>
                                  Cancel
                              </Button> : null}
                      </div>}>
                    <Form.Item key={'image'} {...formItemLayout} label={'Patient Image'}>
                        {getFieldDecorator('image', {valuePropName: 'image',})(
                            <Upload {...singleUploadprops}>
                                <Button>
                                    <Icon type="upload"/> Select File
                                </Button>
                                {this.state.patientDetails && this.state.patientDetails.image ?
                                    <img
                                        src={makeFileURL(this.state.patientDetails ? this.state.patientDetails.image : null)}
                                        style={{maxWidth: '100%'}}/> : null}
                            </Upload>
                        )}
                        <span className="ant-form-text">
                                    <a onClick={() => that.toggleWebCam('image', Math.random())}>
                                        Open Webcam
                                    </a>
                                </span>
                        <Modal
                            footer={null}
                            onCancel={() => that.toggleWebCam('image', false)}
                            visible={!!that.state.webCamState['image']}
                            width={680}
                            key={that.state.webCamState['image']}>
                            <WebCamField getScreenShot={(value) => that.getImageandUpload('image', value)}/>
                        </Modal>
                    </Form.Item>
                    <Form.Item label="Patient Name" {...formItemLayout}>
                        {getFieldDecorator('first_name', {
                            rules: [{required: true, message: 'Input Patient Name!'}],
                            initialValue: this.state.patientDetails ? this.state.patientDetails.user.first_name : ''
                        })
                        (<Input placeholder="Patient Name"/>)
                        }
                    </Form.Item>

                    <Form.Item label="Patient Id" {...formItemLayout}>
                        {getFieldDecorator('custom_id', {
                            initialValue: this.state.patientDetails ? this.state.patientDetails.custom_id : ''
                        })
                        (<Input placeholder="Patient Id"/>)
                        }
                    </Form.Item>


                    {this.state.source && this.state.source == INPUT_FIELD ?
                        <Form.Item key={'source_extra'} label={"Source"}  {...formItemLayout}>
                            {getFieldDecorator("source_extra", {
                                initialValue: '',

                            })(
                                <Input placeholder="Source"/>
                            )}
                            <a onClick={() => that.setFormParams('source', SELECT_FIELD)}>Choose
                                Source</a>
                        </Form.Item>
                        :  <Form.Item label={"Source"} {...formItemLayout}>
                        {getFieldDecorator('source', {initialValue: this.state.patientDetails ? this.state.patientDetails.source : null})
                        (<Select placeholder={"Select Source"} showSearch optionFilterProp="children">
                            {this.state.sourceList.map((option) => <Select.Option value={option.id}>
                                {option.name}
                            </Select.Option>)}
                        </Select>)
                        }
                        <a onClick={() => that.setFormParams('source', INPUT_FIELD)}>Enter New
                                Source</a>
                    </Form.Item>
                    }
                    {this.state.patientDetails ? null :
                        <Form.Item label="Referral Code" {...formItemLayout}>
                            {getFieldDecorator('referal', {initialValue: this.state.patientDetails ? this.state.patientDetails.user.referer_code : ''})
                            (<Input placeholder="Referral Code"/>)
                            }
                        </Form.Item>
                    }
                    <Form.Item label="Aadhar ID" {...formItemLayout}>
                        {getFieldDecorator('aadhar_id', {initialValue: this.state.patientDetails ? this.state.patientDetails.aadhar_id : ''})
                        (<Input placeholder="Patient Aadhar Number"/>)
                        }
                    </Form.Item>

                    <Form.Item label="Gender" {...formItemLayout}>
                        {getFieldDecorator('gender', {initialValue: this.state.patientDetails ? this.state.patientDetails.gender : null})
                        (<Select placeholder={"Select Gender"}>
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                            <Option value="other">Other</Option>
                        </Select>)
                        }
                    </Form.Item>


                    <Form.Item label=' ' {...formItemLayout} colon={false}>
                        <Radio.Group buttonStyle="solid" size="small" onChange={this.changeFormType}
                                     defaultValue={this.state.selectedFormType}>
                            {PATIENT_AGE.map((item) => <Radio value={item.value}>{item.label}</Radio>)}
                        </Radio.Group>
                    </Form.Item>
                    {this.state.selectedFormType == 'DOB' ?
                        <Form.Item label="DOB" {...formItemLayout}>
                            {getFieldDecorator('dob', {initialValue: this.state.patientDetails && this.state.patientDetails.dob ? moment(this.state.patientDetails.dob) : ''})
                            (<DatePicker/>)
                            }
                        </Form.Item>
                        : <Form.Item label="Age" {...formItemLayout}>
                            {getFieldDecorator('age', {initialValue: this.state.patientDetails && this.state.patientDetails.dob ? moment().diff(this.state.patientDetails.dob, 'years') : null})
                            (<InputNumber min={0} max={120} placeholder="Patient Age"/>)
                            }
                        </Form.Item>}

                    <Form.Item label="Anniversary" {...formItemLayout}>
                        {getFieldDecorator('anniversary', {initialValue: this.state.patientDetails && this.state.patientDetails.anniversary ? moment(this.state.patientDetails.anniversary) : null})
                        (<DatePicker/>)
                        }
                    </Form.Item>

                    {/*<Form.Item label="Blood Group" {...formItemLayout}>*/}
                    {/*    {getFieldDecorator('blood_group', {initialValue: this.props.currentPatient ? this.props.currentPatient.blood_group : ''})*/}
                    {/*    (<Input placeholder="Patient Blood Group"/>)*/}
                    {/*    }*/}
                    {/*</Form.Item>*/}
                    <Form.Item label="Blood Group" {...formItemLayout}>
                        {getFieldDecorator("blood_group", {initialValue: this.state.patientDetails ? this.state.patientDetails.blood_group : ''})
                        (<Select placeholder="Blood Group">
                            {BLOOD_GROUPS.map((option) => <Select.Option
                                value={option.value}>{option.name}</Select.Option>)}
                        </Select>)
                        }
                    </Form.Item>

                    {/*<Form.Item label="Family" {...formItemLayout}>*/}
                    {/*    {getFieldDecorator('family_relation', {initialValue: this.state.patientDetails ? this.props.currentPatient.family_relation : ''})*/}
                    {/*    (<Input placeholder="Patient Family Relation"/>)*/}
                    {/*    }*/}
                    {/*</Form.Item>*/}

                    <Form.Item label="Family" {...formItemLayout}>
                        <Form.Item style={{ display: 'inline-block',width: 'calc(30% - 12px)'}}>
                            {getFieldDecorator("family_relation")
                            (<Select defaultValue={'Relation'}>
                                <Select.Option value={''}>{'Relation'}</Select.Option>
                                {FAMILY_GROUPS.map((option) => <Select.Option
                                    value={option.value}>{option.name}</Select.Option>)}
                            </Select>)
                            }
                        </Form.Item>
                        <span style={{ display: 'inline-block', width: '14px', textAlign: 'center' }} />
                        <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                            {getFieldDecorator("attendee", {initialValue: this.state.patientDetails ? this.state.patientDetails.attendee : ''})
                                (<Input/>)
                            }
                        </Form.Item>
                    </Form.Item>


                    <Form.Item label="Mobile (Primary)" {...formItemLayout}>
                        {getFieldDecorator('mobile', {
                            initialValue: this.props.currentPatient ? this.props.currentPatient.user.mobile : null,
                            rules: [{required: true, message: 'Input Mobile Number'}]
                        })
                        (<Input placeholder="Patient Mobile Number (Primary)"/>)
                        }
                    </Form.Item>

                    <Form.Item label="Mobile (Secondary)" {...formItemLayout}>
                        {getFieldDecorator('secondary_mobile_no', {initialValue: this.props.currentPatient ? this.props.currentPatient.secondary_mobile_no : ''})
                        (<Input placeholder="Patient Mobile Number (Secondary)"/>)
                        }
                    </Form.Item>

                    <Form.Item label="Landline" {...formItemLayout}>
                        {getFieldDecorator('landline_no', {initialValue: this.props.currentPatient ? this.props.currentPatient.landline_no : ''})
                        (<Input placeholder="Patient Landline Number"/>)
                        }
                    </Form.Item>

                    <Form.Item label="Address" {...formItemLayout}>
                        {getFieldDecorator('address', {initialValue: this.props.currentPatient ? this.props.currentPatient.address : ''})
                        (<Input placeholder="Patient Address"/>)
                        }
                    </Form.Item>

                    <Form.Item label="Locality" {...formItemLayout}>
                        {getFieldDecorator('locality', {initialValue: this.props.currentPatient ? this.props.currentPatient.locality : ''})
                        (<Input placeholder="Patient Locality"/>)
                        }
                    </Form.Item>

                    {this.state.country && this.state.country == INPUT_FIELD ?
                        <Form.Item key={'country_extra'} label={"Country"}  {...formItemLayout}>
                            {getFieldDecorator("country_extra", {
                                initialValue: '',

                            })(
                                <Input placeholder="Country"/>
                            )}
                            <a onClick={() => that.setFormParams('country', SELECT_FIELD)}>Choose
                                Country</a>
                        </Form.Item>
                        : <Form.Item key={"country"} {...formItemLayout} label={"Country"}>
                            {getFieldDecorator("country", {
                                initialValue: this.props.currentPatient && this.props.currentPatient.country_data ? this.props.currentPatient.country_data.id : '',
                            })(
                                <Select placeholder="Select Country"
                                        onChange={(value) => this.onChangeValue("country", value)} showSearch
                                        optionFilterProp="children">

                                    {this.state.countrylist.map((option) => <Select.Option
                                        value={option.id}>{option.name}</Select.Option>)}
                                </Select>
                            )}
                            <a onClick={() => that.setFormParams('country', INPUT_FIELD)}>Add New
                                Country</a>
                        </Form.Item>
                    }


                    {this.state.country == INPUT_FIELD || this.state.state && this.state.state == INPUT_FIELD ?
                        <Form.Item key={'state_extra'} label={"State"}  {...formItemLayout}>
                            {getFieldDecorator("state_extra", {
                                initialValue: '',

                            })(
                                <Input placeholder="State"/>
                            )}
                            <a onClick={() => that.setFormParams('state', SELECT_FIELD)}>Choose
                                State</a>
                        </Form.Item>
                        : <Form.Item key={"state"} {...formItemLayout} label={"State"}>
                            {getFieldDecorator("state", {
                                initialValue: this.props.currentPatient && this.props.currentPatient.state_data ? this.props.currentPatient.state_data.id : '',
                            })(
                                <Select placeholder="Select State"
                                        onChange={(value) => this.onChangeValue("state", value)} showSearch
                                        optionFilterProp="children">
                                    {this.state.stateList.map((option) => <Select.Option
                                        value={option.id}>{option.name}</Select.Option>)}
                                </Select>
                            )}
                            <a onClick={() => that.setFormParams('state', INPUT_FIELD)}>Add New
                                state</a>
                        </Form.Item>
                    }
                    {this.state.country == INPUT_FIELD || this.state.state == INPUT_FIELD || this.state.city && this.state.city == INPUT_FIELD ?
                        <Form.Item key={'city_extra'} label={"City"}  {...formItemLayout}>
                            {getFieldDecorator("city_extra", {
                                initialValue: '',
                            })(
                                <Input placeholder="City"/>
                            )}
                            <a onClick={() => that.setFormParams('city', SELECT_FIELD)}>Choose
                                City</a>
                        </Form.Item>
                        : <Form.Item key={"City"} {...formItemLayout} label={"City"}>
                            {getFieldDecorator("city", {
                                initialValue: this.props.currentPatient && this.props.currentPatient.city_data ? this.props.currentPatient.city_data.id : '',
                            })(
                                <Select showSearch optionFilterProp="children" placeholder="Select City">
                                    {this.state.cityList.map((option) => <Select.Option
                                        value={option.id}>{option.name}</Select.Option>)}
                                </Select>
                            )}
                            <a onClick={() => that.setFormParams('city', INPUT_FIELD)}>Add New
                                City</a>
                        </Form.Item>
                    }


                    {/* <Form.Item label="City" {...formItemLayout}>
                        {getFieldDecorator('city_extra', {initialValue: this.props.currentPatient ? this.props.currentPatient.city : null})
                        (<Input placeholder="Patient City"/>)
                        }
                    </Form.Item> */}

                    <Form.Item label="Pincode" {...formItemLayout}>
                        {getFieldDecorator('pincode', {initialValue: this.props.currentPatient ? this.props.currentPatient.pincode : ''})
                        (<Input placeholder="Patient PINCODE"/>)
                        }
                    </Form.Item>

                    <Form.Item label="Email" {...formItemLayout}>
                        {getFieldDecorator('email', {
                            initialValue: this.props.currentPatient ? this.props.currentPatient.user.email : null,
                        })
                        (<Input placeholder="Patient Email"/>)
                        }
                    </Form.Item>

                    <Form.Item label="Medical History" {...formItemLayout}>
                        {getFieldDecorator("medical_history", {initialValue: this.props.currentPatient ? this.props.currentPatient.medical_history : []})
                        (<Select placeholder="Medical History" mode={"multiple"}>
                            {historyOption.map((option) => <Select.Option
                                value={option.value}>{option.label}</Select.Option>)}
                        </Select>)
                        }
                    </Form.Item>

                    <Form.Item label="Patient Group" {...formItemLayout}>
                        {getFieldDecorator("patient_group", {initialValue: this.props.currentPatient ? this.props.currentPatient.patient_group : []})
                        (<Select placeholder="Patient Group" mode={"multiple"}>
                            {patientGroupOption.map((option) => <Select.Option
                                value={option.value}>{option.label}</Select.Option>)}
                        </Select>)
                        }
                    </Form.Item>

                    <Form.Item label="On Dialysis" {...formItemLayout}>
                        {getFieldDecorator('on_dialysis', {initialValue: this.props.currentPatient ? this.props.currentPatient.on_dialysis : false})
                        (<Checkbox onChange={(e) => this.onChangeCheckbox(e)} style={{paddingTop: '4px'}}/>)
                        }
                    </Form.Item>
                    <Form.Item label="Allow File Upload" {...formItemLayout}>
                        {getFieldDecorator('file_enable', {initialValue: this.props.currentPatient ? this.props.currentPatient.file_enable : true})
                        (<Checkbox style={{paddingTop: '4px'}}
                                   defaultChecked={true}/>)
                        }
                    </Form.Item>

                    {/*<Form.Item label="Allow File Upload" {...formItemLayout}>*/}
                    {/*    {getFieldDecorator('file_enable',)*/}
                    {/*    (<Checkbox  defaultChecked={true}/>)*/}
                    {/*    }*/}
                    {/*</Form.Item>*/}

                    <Form.Item label="Max Uploads Allowed" {...formItemLayout}>
                        {getFieldDecorator('file_count', {initialValue: this.props.currentPatient ? this.props.currentPatient.file_count : 10})
                        (<InputNumber min={0}/>)
                        }
                    </Form.Item>
                    <Form.Item>
                        <Button style={{margin: 5}} type="primary" htmlType="submit">
                            Submit
                        </Button>
                        {that.props.history ?
                            <Button style={{margin: 5}} onClick={() => that.props.history.goBack()}>
                                Cancel
                            </Button> : null}
                    </Form.Item>
                </Card>
            </Form>)
    }

}

export default Form.create()(EditPatientDetails);
