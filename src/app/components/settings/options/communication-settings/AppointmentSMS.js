import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Col, Form, Row, Select} from "antd";
import {
    SUCCESS_MSG_TYPE,
    INPUT_FIELD, SMS_FIELD, SINGLE_CHECKBOX_FIELD, TIME_PICKER, SELECT_FIELD, LABEL_FIELD
} from "../../../../constants/dataKeys";
import {COMMUNICATONS_API} from "../../../../constants/api"
import {getAPI, displayMessage, interpolate} from "../../../../utils/common";
import {
    APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS,
    LANGUAGE,
    PROMO_CODE_RUPEE_SMS_TAG_OPTIONS,
    PROMO_CODE_SMS_TAG_OPTIONS,
    SMS_LANGUAGE_CONFIG_PARAM
} from "../../../../constants/hardData";
import moment from "moment";
import {loadConfigParameters} from "../../../../utils/clinicUtils";


class AppointmentSMS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            data: null,
            language: this.props.activePracticeData && this.props.activePracticeData.language ? this.props.activePracticeData.language : '',
            [SMS_LANGUAGE_CONFIG_PARAM]:[]
        };
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
        loadConfigParameters(this, [SMS_LANGUAGE_CONFIG_PARAM]);
    }

    loadData() {
        var that = this;
        let reqData = {};
        let successFn = function (data) {
            console.log("length", data.length - 1);
            that.setState({
                data: data[data.length - 1],
            })
        };
        let errorFn = function () {
        };
        if (that.state.language) {
            reqData.language = that.state.language;
        }
        getAPI(interpolate(COMMUNICATONS_API, [this.props.active_practiceId]), successFn, errorFn, reqData);
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    handleChangeLanguage = (type, value) => {
        let that = this;
        that.setState({
            [type]: value,
        }, function () {
            that.loadData();
        })
    };

    render() {
        let that = this;
        const fields = [
            //     {
            //     label: "SMS Language",
            //     key: "sms_language",
            //     placeholder:"SMS Language",
            //     initialValue: this.state.data && this.state.data.sms_language? this.state.data.sms_language : this.props.activePracticeData.language,
            //     extra: "SMS to Patients will be sent in this language",
            //     type: SELECT_FIELD,
            //     options:LANGUAGE,
            //     // onchange:()
            // },
            {
                label: "Contact Number",
                key: "contact_number",
                placeholder: "Contact Number",
                initialValue: this.state.data ? this.state.data.contact_number : ' ',
                extra: "Maximum 15 characters & represented as {{CLINICCONTACTNUMBER}}",
                type: INPUT_FIELD
            }, {
                label: "Email",
                key: "email",
                placeholder: "Email Address",
                initialValue: this.state.data ? this.state.data.email : ' ',
                extra: "All replies by Patients for emails will be sent to this address",
                type: INPUT_FIELD
            }, {
                label: "SMS clinic Name",
                key: "sms_clinic_name",
                placeholder: "Clinic Name",
                initialValue: this.state.data ? this.state.data.sms_clinic_name : ' ',
                extra: "{{CLINIC}} will use this name.",
                type: INPUT_FIELD,
            }, {
                key: "appointment_confirmation_sms",
                placeholder: "Appointment Confirmation SMS Text",
                initialValue: this.state.data ? this.state.data.appointment_confirmation_sms : false,
                type: SINGLE_CHECKBOX_FIELD,
                extra: "SMS is sent to the Patient on successfully adding an appointment",
                follow: <b>APPOINTMENT CONFIRMATION SMS</b>
            }, {
                key: "appointment_confirmation_text",
                placeholder: "Appointment Cancellation SMS Text",
                initialValue: this.state.data ? this.state.data.appointment_confirmation_text : null,
                minRows: 4,
                type: SMS_FIELD,
                options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS
            }, {
                key: "appointment_cancellation_sms",
                initialValue: this.state.data ? this.state.data.appointment_cancellation_sms : false,
                type: SINGLE_CHECKBOX_FIELD,
                extra: "SMS is sent to the Patient when the appointment is cancelled",
                follow: <b>APPOINTMENT CANCELLATION SMS</b>
            }, {
                key: "appointment_cancellation_text",
                placeholder: "Appointment Cancellation SMS Text",
                initialValue: this.state.data ? this.state.data.appointment_cancellation_text : null,
                minRows: 4,
                type: SMS_FIELD,
                options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS
            }, {
                key: "appointment_reminder_sms",
                placeholder: "Appointment Reminder SMS Text",
                initialValue: this.state.data ? this.state.data.appointment_reminder_sms : false,
                type: SINGLE_CHECKBOX_FIELD,
                extra: "This SMS is automatically sent to the Patient at selected time & date before the appointment.",
                follow: <b>APPOINTMENT REMINDER SMS</b>
            }, {
                key: "appointment_reminder_text",
                placeholder: "Appointment Reminder SMS Text",
                initialValue: this.state.data ? this.state.data.appointment_reminder_text : null,
                minRows: 4,
                type: SMS_FIELD,
                options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS
            }, {
                key: "send_on_day_of_appointment",
                initialValue: this.state.data ? this.state.data.send_on_day_of_appointment : false,
                type: SINGLE_CHECKBOX_FIELD,
                follow: "Send reminder SMS on the day of appointment at 7:30 AM",
            }, {
                key: "send_on_day_of_appointment",
                initialValue: this.state.data ? this.state.data.send_on_day_of_appointment : false,
                follow: "Send reminder SMS on the day before the appointment at",
                type: SINGLE_CHECKBOX_FIELD,
            }, {
                key: "send_on_day_of_appointment_time",
                initialValue: this.state.data && moment(this.state.data.send_on_day_of_appointment_time).isValid() ? moment(this.state.data.send_on_day_of_appointment_time) : null,
                type: TIME_PICKER
            }, {
                key: "follow_up_reminder_sms",
                initialValue: this.state.data ? this.state.data.follow_up_reminder_sms : false,
                type: SINGLE_CHECKBOX_FIELD,
                extra: "This SMS is sent to the Patient on the morning of the followup sms.",
                follow: <b>FOLLOW UP REMINDER SMS</b>
            }, {
                key: "follow_up_reminder_sms_text",
                placeholder: "Follow-up Reminder SMS Text",
                initialValue: this.state.data ? this.state.data.follow_up_reminder_sms_text : null,
                minRows: 4,
                type: SMS_FIELD,
                options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS
            }, {
                key: "send_follow_up_reminder_time",
                initialValue: this.state.data ? this.state.data.send_follow_up_reminder_time : null,
                extra: "Time to Send follow-up SMS after the last appointment.",
                type: SELECT_FIELD,
                options: [{label: '1 Month', value: 1}, {label: '3 Month', value: 3}, {label: '6 Month', value: 6}]
            }, {
                key: "payment_sms",
                initialValue: this.state.data ? this.state.data.payment_sms : false,
                type: SINGLE_CHECKBOX_FIELD,
                extra: "This SMS is sent to the Patient when payment is received.",
                follow: <b>PAYMENT SMS</b>
            }, {
                key: "payment_sms_text",
                placeholder: "Payment SMS Text",
                initialValue: this.state.data ? this.state.data.payment_sms_text : null,
                minRows: 4,
                type: SMS_FIELD,
                options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS
            }, {
                key: "promo_code_text",
                initialValue: this.state.data ? this.state.data.promo_code_text : false,
                type: LABEL_FIELD,
                extra: "This SMS is sent to the Patient for promo code.",
                follow: <b>Promo Code Fixed Rupee SMS Text</b>
            }, {
                key: "promo_code_value_text",
                placeholder: "Promo Code Fixed Rupee SMS Text",
                initialValue: this.state.data ? this.state.data.promo_code_value_text : null,
                minRows: 4,
                type: SMS_FIELD,
                options: PROMO_CODE_RUPEE_SMS_TAG_OPTIONS
            },{
                key: "promo_code_text",
                initialValue: this.state.data ? this.state.data.promo_code_text : false,
                type: LABEL_FIELD,
                extra: "This SMS is sent to the Patient for promo code.",
                follow: <b>Promo Code Percent Discount SMS Text</b>
            },{
                key: "promo_code_precent_text",
                placeholder: "Promo Code Percent Discount SMS Text",
                initialValue: this.state.data ? this.state.data.promo_code_precent_text : null,
                minRows: 4,
                type: SMS_FIELD,
                options: PROMO_CODE_SMS_TAG_OPTIONS
            },
            {
                key: "lab_order_confirmation_sms",
                initialValue: this.state.data ? this.state.data.lab_order_confirmation_sms : false,
                type: SINGLE_CHECKBOX_FIELD,
                extra: "This SMS is sent to the Patient when he is prescribed a lab order.",
                follow: <b>LAB ORDER CONFIRMATION SMS</b>
            }, {
                key: "lab_order_confirmation_text",
                placeholder: "Lab Order Confirmation SMS Text",
                initialValue: this.state.data ? this.state.data.lab_order_confirmation_text : null,
                minRows: 4,
                type: SMS_FIELD,
                options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS
            }, {
                key: "lab_order_due_on_sms",
                placeholder: "Lab Order Due On SMS Text",
                initialValue: this.state.data ? this.state.data.lab_order_due_on_sms : false,
                extra: "This SMS is sent to the Patient informing lab order due date",
                type: SINGLE_CHECKBOX_FIELD,
                follow: <b>LAB ORDER DUE ON SMS</b>
            }, {
                key: "lab_order_result_sms",
                initialValue: this.state.data ? this.state.data.lab_order_result_sms : false,
                extra: "This SMS is sent to the Patient when lab order results are ready",
                type: SINGLE_CHECKBOX_FIELD,
                follow: <b>LAB ORDER RESULT SMS</b>
            }, {
                key: "lab_order_reminder_sms",
                initialValue: this.state.data ? this.state.data.lab_order_reminder_sms : false,
                type: SINGLE_CHECKBOX_FIELD,
                extra: "This reminder SMS is sent to the Patient",
                follow: <b>LAB ORDER REMINDER SMS</b>
            },];
        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success");
                that.loadData();
            },
            errorFn: function () {

            },
            action: interpolate(COMMUNICATONS_API, [that.props.active_practiceId]),
            method: "post",
        };
        const defaultValues = [
            {"key": "practice", "value": this.props.active_practiceId},
            {"key": "id", "value": this.state.data ? this.state.data.id : null},
            {"key": "sms_language", "value": this.state.language}
        ];

        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
            <Row>
                <Col span={8}>
                    <span style={{float: 'right', color: 'rgba(0, 0, 0, 0.85)'}}>SMS Language : &nbsp;</span>
                </Col>
                <Col span={8}>
                    <Select
                        defaultValue={this.data && this.data.sms_language ? this.data.sms_language : that.state.language}
                        style={{width: 220}} onChange={(value) => this.handleChangeLanguage('language', value)}>
                        {this.state[SMS_LANGUAGE_CONFIG_PARAM].map((option) => <Select.Option value={option}>
                            {option}
                        </Select.Option>)}
                    </Select>
                    <br/>
                    <span>SMS to Patients will be sent in this language</span>
                </Col>

            </Row>

            <TestFormLayout formProp={formProp} defaultValues={defaultValues}
                            fields={fields} {...this.props}/>
        </div>
    }
}

export default AppointmentSMS;
