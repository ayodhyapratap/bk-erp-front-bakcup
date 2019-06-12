import React from "react";
import {Route} from "react-router";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row, Input,Select, DatePicker} from "antd";
import {
    CHECKBOX_FIELD,
    DATE_PICKER,
    NUMBER_FIELD,
    SUCCESS_MSG_TYPE,
    INPUT_FIELD,
    RADIO_FIELD,
    SELECT_FIELD, EMAIL_FIELD, MULTI_SELECT_FIELD
} from "../../../constants/dataKeys";
import {PATIENTS_LIST, PATIENT_PROFILE, MEDICAL_HISTORY, PATIENT_GROUPS, MEMBERSHIP_API} from "../../../constants/api";
import {getAPI, postAPI,interpolate, displayMessage} from "../../../utils/common";
import {Link, Redirect} from 'react-router-dom'
import moment from 'moment';

const { Option } = Select;
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
<<<<<<< Updated upstream
        this.handleSubmit = this.handleSubmit.bind(this);

=======
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
            if (!err) {
                let reqData = {
                    ...values,
                    medical_history:[values.medical_history],
                    patient_group:[values.patient_group],
                    user:{first_name:values.first_name,
                            mobile:values.mobile, 
                            referer_code:values.referer_code,
                            email: values.email
                        },
                    dob:moment(values.dob).format("YYYY-MM-DD"),
                    anniversary:moment(values.anniversary).format("YYYY-MM-DD"),
                };
                delete reqData.first_name;
                delete reqData.email;
                delete reqData.referer_code;
                delete reqData.mobile;
                delete reqData.medical_history;
                delete reqData.patient_group;
                that.setState({
                });
                let successFn = function (data) {
                    displayMessage("successfully");
                    that.setState({

                    });

                }
                let errorFn = function () {
                    that.setState({

                    })
                }
                postAPI(interpolate(PATIENTS_LIST, [that.props.match.params.id]), reqData, successFn, errorFn);
=======
    render() {
        console.log(this.props.currentPatient);
        const fields = [{
            label: "Patient Name",
            placeholder: "Patient Name",
            key: "user.first_name",
            required: true,
            initialValue: this.props.currentPatient ? this.props.currentPatient.user.first_name : null,
            type: INPUT_FIELD
        }, {
            label: "Referral Code",
            placeholder: "Referral Code",
            key: "user.referer_code",
            initialValue: this.props.currentPatient ? this.props.currentPatient.user.referer_code : null,
            type: INPUT_FIELD
        }, {
            label: "Aadhar ID",
            key: "aadhar_id",
            placeholder: "Patient Aadhar Number",
            // required: true,
            initialValue: this.props.currentPatient ? this.props.currentPatient.aadhar_id : null,
            type: INPUT_FIELD
        }, {
            label: "Gender",
            key: "gender",
            type: SELECT_FIELD,
            initialValue: this.props.currentPatient ? this.props.currentPatient.gender : null,
            options: [{label: "Male", value: "male"}, {label: "female", value: "female"}, {
                label: "other",
                value: "other"
            }]
        }, {
            label: "DOB",
            key: "dob",
            placeholder: "Patient DOB",
            initialValue: this.props.currentPatient && this.props.currentPatient.dob ? moment(this.props.currentPatient.dob).format("YYYY-MM-DD") : '',
            format: "YYYY-MM-DD",
            type: DATE_PICKER
        }, {
            label: "Anniversary",
            key: "anniversary",
            placeholder: "Patient Anniversary",
            initialValue: this.props.currentPatient && this.props.currentPatient.anniversary ? moment(this.props.currentPatient.anniversary) : null,
            format: "YYYY-MM-DD",
            type: DATE_PICKER
        }, {
            label: "Blood Group",
            key: "blood_group",
            placeholder: "Patient Blood Group",
            initialValue: this.props.currentPatient ? this.props.currentPatient.blood_group : null,
            type: INPUT_FIELD
        }, {
            label: "Family Relation",
            key: "family_relation",
            placeholder: "Patient Family Relation",
            initialValue: this.props.currentPatient ? this.props.currentPatient.family_relation : null,
            type: INPUT_FIELD,
        }, {
            label: "Mobile (Primary)",
            key: "user.mobile",
            placeholder: "Patient Mobile Number (Primary)",
            initialValue: this.props.currentPatient ? this.props.currentPatient.user.mobile : null,
            type: INPUT_FIELD,
            required: true,
            disabled: !!this.props.currentPatient
        }, {
            label: "Mobile (Secondary)",
            key: "secondary_mobile_no",
            placeholder: "Patient Mobile Number (Secondary",
            initialValue: this.props.currentPatient ? this.props.currentPatient.secondary_mobile_no : null,
            type: INPUT_FIELD,
        }, {
            label: "Landline",
            key: "landline_no",
            placeholder: "Patient Landline Number",
            initialValue: this.props.currentPatient ? this.props.currentPatient.landline_no : null,
            type: INPUT_FIELD,
        }, {
            label: "Address",
            key: "address",
            placeholder: "Patient Address",
            initialValue: this.props.currentPatient ? this.props.currentPatient.address : null,
            type: INPUT_FIELD,
        }, {
            label: "Locality",
            key: "locality",
            placeholder: "Patient Locality",
            initialValue: this.props.currentPatient ? this.props.currentPatient.locality : null,
            type: INPUT_FIELD,
        }, {
            label: "City",
            key: "city",
            placeholder: "Patient City",
            initialValue: this.props.currentPatient ? this.props.currentPatient.city : null,
            type: INPUT_FIELD
        }, {
            label: "Pincode",
            key: "pincode",
            placeholder: "Patient PINCODE",
            initialValue: this.props.currentPatient ? this.props.currentPatient.pincode : null,
            type: INPUT_FIELD
        }, {
            label: "Email",
            required: true,
            key: "user.email",
            placeholder: "Patient Email",
            initialValue: this.props.currentPatient ? this.props.currentPatient.user.email : null,
            type: EMAIL_FIELD
        }, {
            label: "Medical History",
            key: "medical_history",
            options: this.state.history.map(item => Object.create({
                label: item.name,
                value: item.id
            })),
            initialValue: this.props.currentPatient ? this.props.currentPatient.medical_history : null,
            type: MULTI_SELECT_FIELD
        }, {
            label: "Patient Group",
            key: "patient_group",
            options: this.state.patientGroup.map(item => Object.create({
                label: item.name,
                value: item.id
            })),
            initialValue: this.props.currentPatient ? this.props.currentPatient.patient_group : null,
            type: MULTI_SELECT_FIELD
        }, {
            label: "Membership",
            key: "medical_membership",
            options: this.state.membership.map(item => Object.create({
                label: item.name,
                value: item.id
            })),
            initialValue: this.props.currentPatient ? this.props.currentPatient.medical_membership : null,
            type: SELECT_FIELD
        }];


        let editformProp;
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        if (this.props.currentPatient) {
            editformProp = {
                successFn: function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "success")

                    console.log(data);
                },
                errorFn: function () {

                },
                action: interpolate(PATIENT_PROFILE, [this.props.currentPatient.id]),
                method: "put",
>>>>>>> Stashed changes
            }
        });
    }
    render() {
        let that =this;
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
        const patientGroupOption=[]
        if(this.state.patientGroup){
            this.state.patientGroup.forEach(function (patientGroupItem){
                patientGroupOption.push({label:(patientGroupItem.name) , value:patientGroupItem.id});
            });
        }

        const membershipOption=[]
        if(this.state.membership){
            this.state.membership.forEach(function (membershipItem){
                membershipOption.push({label:(membershipItem.name) , value:membershipItem.id});
            });
        }

        return(
            <Form onSubmit={that.handleSubmit}>
            <Card title="Create Patient"  extra={<Button type="primary" htmlType="submit">submit</Button>}>
                <Form.Item label="Patient Name" {...formItemLayout}>
                    {getFieldDecorator('first_name', { initialValue: this.props.currentPatient ? this.props.currentPatient.user.first_name : null})
                        (<Input placeholder="Patient Name"/>)
                    }
                </Form.Item>

                <Form.Item label="Referral Code" {...formItemLayout}>
                    {getFieldDecorator('referer_code', { initialValue: this.props.currentPatient ? this.props.currentPatient.user.referer_code : null})
                        (<Input placeholder="Referral Code"/>)
                    }
                </Form.Item>

                <Form.Item label="Aadhar ID" {...formItemLayout}>
                    {getFieldDecorator('aadhar_id' ,{initialValue:this.props.currentPatient ? this.props.currentPatient.user.aadhar_id:null})
                    (<Input placeholder="Patient Aadhar Number"/>)
                    }
                </Form.Item>
                
                <Form.Item label="Gender" {...formItemLayout}>
                    {getFieldDecorator('gender',{initialValue:"male"})
                    ( <Select>
                        <Option value="male">Male</Option>
                        <Option value="female">Female</Option>
                        <Option value="other">Other</Option>
                    </Select>)
                    }
                </Form.Item>

                <Form.Item label="DOB" {...formItemLayout}>
                    {getFieldDecorator('dob' ,{})
                    (<DatePicker/>)
                    }
                </Form.Item>

                <Form.Item label="Anniversary" {...formItemLayout}>
                    {getFieldDecorator('anniversary' ,{})
                    (<DatePicker/>)
                    }
                </Form.Item>

                <Form.Item label="Blood Group" {...formItemLayout}>
                    {getFieldDecorator('blood_group' ,{})
                    (<Input placeholder="Patient Blood Group"/>)
                    }
                </Form.Item>

                <Form.Item label="Family Relation" {...formItemLayout}>
                    {getFieldDecorator('family_relation' ,{})
                    (<Input placeholder="Patient Family Relation"/>)
                    }
                </Form.Item>

                <Form.Item label="Mobile (Primary)" {...formItemLayout}>
                    {getFieldDecorator('mobile' ,{ rules: [{ required: true, message: 'Input Mobile Number' }]})
                    (<Input placeholder="Patient Mobile Number (Primary)"/>)
                    }
                </Form.Item>

                <Form.Item label="Mobile (Secondary)" {...formItemLayout}>
                    {getFieldDecorator('secondary_mobile_no' ,{})
                    (<Input placeholder="Patient Mobile Number (Secondary)"/>)
                    }
                </Form.Item>

                <Form.Item label="Landline" {...formItemLayout}>
                    {getFieldDecorator('landline_no' ,{})
                    (<Input placeholder="Patient Landline Number"/>)
                    }
                </Form.Item>

                <Form.Item label="Address" {...formItemLayout}>
                    {getFieldDecorator('address' ,{})
                    (<Input placeholder="Patient Address"/>)
                    }
                </Form.Item>

                <Form.Item label="Locality" {...formItemLayout}>
                    {getFieldDecorator('locality' ,{})
                    (<Input placeholder="Patient Locality"/>)
                    }
                </Form.Item>

                <Form.Item label="City" {...formItemLayout}>
                    {getFieldDecorator('city' ,{})
                    (<Input placeholder="Patient City"/>)
                    }
                </Form.Item>

                <Form.Item label="Pincode" {...formItemLayout}>
                    {getFieldDecorator('pincode' ,{})
                    (<Input placeholder="Patient PINCODE"/>)
                    }
                </Form.Item>

                <Form.Item label="Email" {...formItemLayout}>
                    {getFieldDecorator('email' ,{ rules: [{ required: true, message: 'Input Email ID!' }]})
                    (<Input placeholder="Patient Email"/>)
                    }
                </Form.Item>

                <Form.Item label="Medical History" {...formItemLayout}>
                    {getFieldDecorator("medical_history",{})
                        (<Select placeholder="Medical History">
                        {historyOption.map((option) => <Select.Option
                            value={option.value}>{option.label}</Select.Option>)}
                        </Select>)
                    }
                </Form.Item>

                <Form.Item label="Patient Group" {...formItemLayout}>
                    {getFieldDecorator("patient_group",{})
                        (<Select placeholder="Patient Group">
                        {patientGroupOption.map((option) => <Select.Option
                            value={option.value}>{option.label}</Select.Option>)}
                        </Select>)
                    }
                </Form.Item>

                <Form.Item label="Membership" {...formItemLayout}>
                    {getFieldDecorator("medical_membership",{})
                        (<Select placeholder="Membership">
                        {membershipOption.map((option) => <Select.Option
                            value={option.value}>{option.label}</Select.Option>)}
                        </Select>)
                    }
                </Form.Item>
                {/* <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item> */}
            
        </Card> 
        </Form>)
    }
}

export default  Form.create()(EditPatientDetails);
