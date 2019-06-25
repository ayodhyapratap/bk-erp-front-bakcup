import React from "react";
import {Route} from "react-router";
import {Button, Card, Form, Icon, Row, Input, Select, DatePicker} from "antd";
import {PATIENTS_LIST, PATIENT_PROFILE, MEDICAL_HISTORY, PATIENT_GROUPS, MEMBERSHIP_API} from "../../../constants/api";
import {getAPI, postAPI, interpolate, displayMessage, putAPI} from "../../../utils/common";
import moment from 'moment';
import {REQUIRED_FIELD_MESSAGE} from "../../../constants/messages";
const {Option} = Select;

class EditPatientDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirect: false,
            history: [],
            patientGroup: [],
            membership: []

        }
        this.changeRedirect = this.changeRedirect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.loadMedicalHistory();
        this.getPatientGroup();
        this.getPatientMembership();
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

    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
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
                    medical_history: values.medical_history,
                    patient_group: values.patient_group,
                    user: {
                        first_name: values.first_name ? values.first_name : null,
                        mobile: values.mobile,
                        referer_code: values.referer_code ? values.referer_code : null,
                        email: values.email
                    },
                    dob: moment(values.dob).format("YYYY-MM-DD"),
                    anniversary: moment(values.anniversary).format("YYYY-MM-DD"),
                };
                delete reqData.first_name;
                delete reqData.email;
                delete reqData.referer_code;
                delete reqData.mobile;
                // delete reqData.medical_history;
                // delete reqData.patient_group;
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
                if (that.props.currentPatient) {
                    putAPI(interpolate(PATIENT_PROFILE, [that.props.currentPatient.id]), reqData, successFn, errorFn);
                } else {
                    postAPI(interpolate(PATIENTS_LIST, [that.props.match.params.id]), reqData, successFn, errorFn);
                }
            }
        });
    }

    render() {

        let that = this;
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

        return (
            <Form onSubmit={that.handleSubmit}>
                <Card title={that.props.currentPatient ? "Edit Profile" : "Add Patient"}
                      extra={<div>
                          <Button style={{margin: 5}} type="primary" htmlType="submit">Submit</Button>
                          {that.props.history ?
                              <Button style={{margin: 5}} onClick={() => that.props.history.goBack()}>
                                  Cancel
                              </Button> : null}
                      </div>}>
                    <Form.Item label="Patient Name" {...formItemLayout}>
                        {getFieldDecorator('first_name', {
                            rules: [{required: true, message: 'Input Patient Name!'}],
                            initialValue: this.props.currentPatient ? this.props.currentPatient.user.first_name : null
                        })
                        (<Input placeholder="Patient Name"/>)
                        }
                    </Form.Item>

                    <Form.Item label="Referral Code" {...formItemLayout}>
                        {getFieldDecorator('referer_code', {initialValue: this.props.currentPatient ? this.props.currentPatient.user.referer_code : null})
                        (<Input placeholder="Referral Code"/>)
                        }
                    </Form.Item>

                    <Form.Item label="Aadhar ID" {...formItemLayout}>
                        {getFieldDecorator('aadhar_id', {initialValue: this.props.currentPatient ? this.props.currentPatient.aadhar_id : null})
                        (<Input placeholder="Patient Aadhar Number"/>)
                        }
                    </Form.Item>

                    <Form.Item label="Gender" {...formItemLayout}>
                        {getFieldDecorator('gender', {initialValue: this.props.currentPatient ? this.props.currentPatient.gender : null})
                        (<Select>
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                            <Option value="other">Other</Option>
                        </Select>)
                        }
                    </Form.Item>

                    <Form.Item label="DOB" {...formItemLayout}>
                        {getFieldDecorator('dob', {defaultValue: this.props.currentPatient ? this.props.currentPatient.dob : null})
                        (<DatePicker/>)
                        }
                    </Form.Item>

                    <Form.Item label="Anniversary" {...formItemLayout}>
                        {getFieldDecorator('anniversary', {defaultValue: this.props.currentPatient ? this.props.currentPatient.anniversary : null})
                        (<DatePicker/>)
                        }
                    </Form.Item>

                    <Form.Item label="Blood Group" {...formItemLayout}>
                        {getFieldDecorator('blood_group', {initialValue: this.props.currentPatient ? this.props.currentPatient.blood_group : null})
                        (<Input placeholder="Patient Blood Group"/>)
                        }
                    </Form.Item>

                    <Form.Item label="Family Relation" {...formItemLayout}>
                        {getFieldDecorator('family_relation', {initialValue: this.props.currentPatient ? this.props.currentPatient.family_relation : null})
                        (<Input placeholder="Patient Family Relation"/>)
                        }
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
                        {getFieldDecorator('secondary_mobile_no', {initialValue: this.props.currentPatient ? this.props.currentPatient.secondary_mobile_no : null})
                        (<Input placeholder="Patient Mobile Number (Secondary)"/>)
                        }
                    </Form.Item>

                    <Form.Item label="Landline" {...formItemLayout}>
                        {getFieldDecorator('landline_no', {initialValue: this.props.currentPatient ? this.props.currentPatient.landline_no : null})
                        (<Input placeholder="Patient Landline Number"/>)
                        }
                    </Form.Item>

                    <Form.Item label="Address" {...formItemLayout}>
                        {getFieldDecorator('address', {initialValue: this.props.currentPatient ? this.props.currentPatient.address : null})
                        (<Input placeholder="Patient Address"/>)
                        }
                    </Form.Item>

                    <Form.Item label="Locality" {...formItemLayout}>
                        {getFieldDecorator('locality', {initialValue: this.props.currentPatient ? this.props.currentPatient.locality : null})
                        (<Input placeholder="Patient Locality"/>)
                        }
                    </Form.Item>

                    <Form.Item label="City" {...formItemLayout}>
                        {getFieldDecorator('city', {initialValue: this.props.currentPatient ? this.props.currentPatient.city : null})
                        (<Input placeholder="Patient City"/>)
                        }
                    </Form.Item>

                    <Form.Item label="Pincode" {...formItemLayout}>
                        {getFieldDecorator('pincode', {initialValue: this.props.currentPatient ? this.props.currentPatient.pincode : null})
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
                        {getFieldDecorator("medical_history", {})
                        (<Select placeholder="Medical History">
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
