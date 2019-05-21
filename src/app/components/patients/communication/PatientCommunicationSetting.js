import React from "react";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Button, List, Card, Form, Icon, Row, Table, Divider, Col, Radio} from "antd";
import {SINGLE_CHECKBOX_FIELD, SUCCESS_MSG_TYPE} from "../../../constants/dataKeys";
import {Link} from "react-router-dom";
import {getAPI, displayMessage, interpolate, putAPI} from "../../../utils/common";
import {PATIENT_COMMUNICATION_HISTORY_API, PATIENT_PROFILE} from "../../../constants/api";
import {SMS_ENABLE, BIRTHDAY_SMS_ENABLE, EMAIL_ENABLE} from "../../../constants/hardData";
import moment from "moment";
import CustomizedTable from "../../common/CustomizedTable";

class PatientCommunicationSetting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parient_communication_history: null,
            patientProfile: null,
            saving: false
        };

        this.loadCommunication = this.loadCommunication.bind(this);
        this.loadProfile = this.loadProfile.bind(this);
    }

    componentDidMount() {
        if (this.props.currentPatient) {
            this.loadCommunication();
            this.loadProfile();
        }
    }

    loadProfile() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                patientProfile: data,
                loading: false
            });
        };
        let errorFn = function () {
            that.setState({
                loading: false
            })
        };
        console.log("props", that.props.match.params.id);
        getAPI(interpolate(PATIENT_PROFILE, [that.props.match.params.id]), successFn, errorFn);
    }

    loadCommunication() {
        let that = this;
        let successFn = function (data) {
            that.setState({
                parient_communication_history: data.user_sms,
                loading: false
            })
        }
        let errorFn = function () {
            that.setState({
                loading: false
            })
        }
        getAPI(interpolate(PATIENT_COMMUNICATION_HISTORY_API, [this.props.currentPatient.user.id]), successFn, errorFn)
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    onChanged = (name, value) => {
        this.setState({
            [name]: value,
        });
    }

    handleSubmit = (e) => {
        let that = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                let reqData = {...values};
                that.setState({
                    saving: true
                });
                let successFn = function (data) {
                    displayMessage(SUCCESS_MSG_TYPE, "Communication Settings Saved Successfully!!");
                    that.setState({
                        saving: false
                    });
                }
                let errorFn = function () {
                    that.setState({
                        saving: false
                    });
                }
                putAPI(interpolate(PATIENT_PROFILE, [this.props.currentPatient.id]), reqData, successFn, errorFn);
            }
        });
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 8},
                sm: {span: 8},
                md: {span: 8},
                lg: {span: 8},
            },
            wrapperCol: {
                xs: {span: 16},
                sm: {span: 16},
                md: {span: 16},
                lg: {span: 16},
            },
        };


        const columns = [{
            title: 'SENT TIME',
            dataIndex: 'created_at',
            key: 'created_at',
            render: created_at => <span>{moment(created_at).format('LLL')}</span>,
        }, {
            title: 'MESSAGE',
            dataIndex: 'body',
            key: 'body',
        }, {
            title: 'TYPE',
            dataIndex: 'sms_type',
            key: 'sms_type',
        }, {
            title: 'MESSAGE STATUS',
            dataIndex: 'status',
            key: 'status',
        }];


        const sms_enabled = SMS_ENABLE.map((isSMS) => <Radio value={isSMS.value}>{isSMS.title}</Radio>)
        const email_enabled = EMAIL_ENABLE.map((isEmail) => <Radio value={isEmail.value}>{isEmail.title}</Radio>)
        const bithday_sms_enabled = BIRTHDAY_SMS_ENABLE.map((isBirth_SMS) => <Radio
            value={isBirth_SMS.value}>{isBirth_SMS.title}</Radio>);
        return (<Form onSubmit={this.handleSubmit}>
                <Card
                    title={this.props.currentPatient ? this.props.currentPatient.user.first_name + " Communication" : "Patient Communication"}
                    extra={<Button type="primary" htmlType="submit" loading={this.state.saving}>
                        <Icon type="save"/> Save Communication Setting
                    </Button>}>
                    <Form.Item {...formItemLayout} key={'sms_enable'}> <label>
                        <span className="ant-form-text">{'Enable SMS the patient'} : </span>
                        {getFieldDecorator('sms_enable', {initialValue: this.state.patientProfile ? this.state.patientProfile.sms_enable : false})
                        (
                            <Radio.Group onChange={(e) => this.onChanged('sms_enable', e.target.value)}>
                                {sms_enabled}
                            </Radio.Group>
                        )}
                    </label>
                    </Form.Item>

                    <Form.Item {...formItemLayout} key={'email_enable'}> <label> <span
                        className="ant-form-text">{'Enable Email the patient'} : </span>
                        {getFieldDecorator('email_enable', {initialValue: this.state.patientProfile ? this.state.patientProfile.email_enable : false})
                        (
                            <Radio.Group onChange={(e) => this.onChanged('email_enable', e.target.value)}>
                                {email_enabled}
                            </Radio.Group>
                        )}
                    </label>
                    </Form.Item>

                    <Form.Item {...formItemLayout} key={'birthday_sms_email'}> <label> <span
                        className="ant-form-text"> {"Send Birthday wish SMS & Email"} : </span>
                        {getFieldDecorator('birthday_sms_email', {initialValue: this.state.patientProfile ? this.state.patientProfile.birthday_sms_email : false})
                        (
                            <Radio.Group onChange={(e) => this.onChanged('birthday_sms_email', e.target.value)}>
                                {bithday_sms_enabled}
                            </Radio.Group>
                        )}
                    </label>
                    </Form.Item>

                    <div>
                        <Divider dashed/>
                        <h2>Past Communication</h2>
                        <CustomizedTable loading={this.state.loading} columns={columns}
                               dataSource={this.state.parient_communication_history}/>
                    </div>
                </Card>
            </Form>
        );

    }
}

export default Form.create()(PatientCommunicationSetting);
