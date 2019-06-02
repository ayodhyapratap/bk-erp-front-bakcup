import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form} from "antd";
import {
    SUCCESS_MSG_TYPE,
    INPUT_FIELD, SMS_FIELD, SINGLE_CHECKBOX_FIELD, TIME_PICKER, SELECT_FIELD
} from "../../../../constants/dataKeys";
import {COMMUNICATONS_API} from "../../../../constants/api"
import {getAPI, displayMessage, interpolate} from "../../../../utils/common";
import {
    APPOINTMENT_CANCELATION_SMS_TAG_OPTIONS,
    APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS
} from "../../../../constants/hardData";
import moment from "moment";


class AppointmentSMS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            data: null,
        };
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        var that = this;
        let successFn = function (data) {
            that.setState({
                data: data[0],
            })
        };
        let errorFn = function () {
        };
        getAPI(interpolate(COMMUNICATONS_API, [this.props.active_practiceId]), successFn, errorFn);
    }

    changeRedirect() {
        var redirectVar = this.state.redirect;
        this.setState({
            redirect: !redirectVar,
        });
    }

    render() {
        let that = this;
        const fields = [{
            label: "Contact Number",
            key: "contact_number",
            initialValue: this.state.data ? this.state.data.contact_number : null,
            extra: "Maximum 15 characters & represented as {{CLINICCONTACTNUMBER}}",
            type: INPUT_FIELD
        }, {
            label: "Email",
            key: "email",
            initialValue: this.state.data ? this.state.data.email : null,
            extra: "All replies by Patients for emails will be sent to this address",
            type: INPUT_FIELD
        }, {
            label: "SMS Language",
            key: "sms_language",
            initialValue: this.state.data ? this.state.data.sms_language : null,
            extra: "SMS to Patients will be sent in this language",
            type: INPUT_FIELD
        }, {
            label: "SMS clinic Name",
            key: "sms_clinic_name",
            initialValue: this.state.data ? this.state.data.sms_clinic_name : null,
            extra: "{{CLINIC}} will use this name.",
            type: INPUT_FIELD,
        }, {
            key: "appointment_confirmation_sms",
            initialValue: this.state.data ? this.state.data.appointment_confirmation_sms : false,
            type: SINGLE_CHECKBOX_FIELD,
            extra: "SMS is sent to the Patient on successfully adding an appointment",
            follow: <b>APPOINTMENT CONFIRMATION SMS</b>
        }, {
            key: "appointment_confirmation_text",
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
            initialValue: this.state.data ? this.state.data.appointment_cancellation_text : null,
            minRows: 4,
            type: SMS_FIELD,
            options: APPOINTMENT_CANCELATION_SMS_TAG_OPTIONS
        }, {
            key: "appointment_reminder_sms",
            initialValue: this.state.data ? this.state.data.appointment_reminder_sms : false,
            type: SINGLE_CHECKBOX_FIELD,
            extra: "This SMS is automatically sent to the Patient at selected time & date before the appointment.",
            follow: <b>APPOINTMENT REMINDER SMS</b>
        }, {
            key: "appointment_reminder_text",
            initialValue: this.state.data ? this.state.data.appointment_reminder_text : null,
            minRows: 4,
            type: SMS_FIELD,
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
            initialValue: this.state.data ? this.state.data.follow_up_reminder_sms_text : null,
            minRows: 4,
            type: SMS_FIELD,
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
            initialValue: this.state.data ? this.state.data.payment_sms_text : null,
            minRows: 4,
            type: SMS_FIELD,
        }, {
            key: "lab_order_confirmation_sms",
            initialValue: this.state.data ? this.state.data.lab_order_confirmation_sms : false,
            type: SINGLE_CHECKBOX_FIELD,
            extra: "This SMS is sent to the Patient when he is prescribed a lab order.",
            follow: <b>LAB ORDER CONFIRMATION SMS</b>
        }, {
            key: "lab_order_confirmation_text",
            initialValue: this.state.data ? this.state.data.lab_order_confirmation_text : null,
            minRows: 4,
            type: SMS_FIELD,
            options: [{label: "{{CLINICCONTACTNUMBER}}", value: "{{CLINICCONTACTNUMBER}}"}]
        }, {
            key: "lab_order_due_on_sms",
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
            },
            errorFn: function () {

            },
            action: interpolate(COMMUNICATONS_API, [that.props.active_practiceId]),
            method: "post",
        };
        const defaultValues = [{"key": "practice", "value": this.props.active_practiceId}, {
            "key": "id",
            "value": this.state.data ? this.state.data.id : null,
        }];

        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
            <TestFormLayout formProp={formProp} defaultValues={defaultValues}
                            fields={fields} {...this.props}/>
        </div>
    }
}

export default AppointmentSMS;
