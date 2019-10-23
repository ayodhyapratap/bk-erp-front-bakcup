import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form} from "antd";
import {
    DIVIDER_FIELD,
    SUCCESS_MSG_TYPE,
    SINGLE_CHECKBOX_FIELD, TIME_PICKER, MAIL_TEMPLATE_FIELD, INPUT_FIELD, SINGLE_IMAGE_UPLOAD_FIELD
} from "../../../../constants/dataKeys";
import {EMAIL_COMMUNICATONS_API} from "../../../../constants/api"
import {getAPI, displayMessage, interpolate} from "../../../../utils/common";
import moment from "moment/moment";
import {APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS} from "../../../../constants/hardData";


class Emails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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
        getAPI(interpolate(EMAIL_COMMUNICATONS_API, [this.props.active_practiceId]), successFn, errorFn);
    }

    render() {
        let that = this;
        const fields = [{
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
        },{
            label: "SMS clinic Name",
            key: "email_clinic_name",
            placeholder: "Clinic Name",
            initialValue: this.state.data ? this.state.data.email_clinic_name : ' ',
            extra: "{{CLINIC}} will use this name.",
            type: INPUT_FIELD,
        },{
            label:'Clinic Logo',
            key:'clinic_logo',
            // initialValue: this.state.data ? this.state.data.clinic_logo : ' ',
            type:SINGLE_IMAGE_UPLOAD_FIELD
        },{
            key: "appointment_confirmation_email",
            initialValue: this.state.data ? this.state.data.appointment_confirmation_email : false,
            type: SINGLE_CHECKBOX_FIELD,
            follow: <b>APPOINTMENT CONFIRMATION EMAIL</b>,
            options: [],
            extra: "Email is sent to the Patient on successfully adding an appointment"
        }, {
            key: "appointment_confirmation_email_text",
            initialValue: this.state.data ? this.state.data.appointment_confirmation_email_text : '',
            type: MAIL_TEMPLATE_FIELD,
            options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS,
        }, {
            type: DIVIDER_FIELD
        }, {
            key: "appointment_cancellation_email",
            initialValue: this.state.data ? this.state.data.appointment_cancellation_email : false,
            type: SINGLE_CHECKBOX_FIELD,
            follow: <b>APPOINTMENT CANCELLATION EMAIL</b>,
            extra: "Email is sent to the Patient when the appointment is cancelled"
        }, {
            key: "appointment_cancellation_email_text",
            initialValue: this.state.data ? this.state.data.appointment_cancellation_email_text : '',
            type: MAIL_TEMPLATE_FIELD,
            options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS,
        }, {
            type: DIVIDER_FIELD
        }, {
            key: "appointment_reminder_email",
            initialValue: this.state.data ? this.state.data.appointment_reminder_email : false,
            type: SINGLE_CHECKBOX_FIELD,
            follow: <b>APPOINTMENT REMINDER EMAIL</b>,
            extra: "Email is sent to the Patient on the morning of the appointment date"
        }, {
            key: "send_on_day_of_appointment",
            initialValue: this.state.data ? this.state.data.send_on_day_of_appointment : false,
            type: SINGLE_CHECKBOX_FIELD,
            follow: "Send reminder SMS on the day of appointment at 7:30 AM",
        }, {
            key: "send_before_day_of_appointment",
            initialValue: this.state.data ? this.state.data.send_before_day_of_appointment : false,
            follow: "Send reminder SMS on the day before the appointment at",
            type: SINGLE_CHECKBOX_FIELD,
        }, {
            key: "send_on_day_of_appointment_time",
            initialValue: this.state.data && moment(this.state.data.send_on_day_of_appointment_time).isValid() ? moment(this.state.data.send_on_day_of_appointment_time) : null,
            type: TIME_PICKER
        }, {
            key: "appointment_cancellation_email_text",
            initialValue: this.state.data ? this.state.data.appointment_cancellation_email_text : '',
            type: MAIL_TEMPLATE_FIELD,
            options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS,
        }, {
            type: DIVIDER_FIELD
        }, {
            key: "followup_reminder_email",
            initialValue: this.state.data ? this.state.data.followup_reminder_email : false,
            type: SINGLE_CHECKBOX_FIELD,
            follow: <b>FOLLOW-UP REMINDER EMAIL</b>,
            extra: "Email is sent to the Patient on the morning of their planned follow-up date"
        }, {
            key: "appointment_reminder_email_text",
            initialValue: this.state.data ? this.state.data.appointment_reminder_email_text : '',
            type: MAIL_TEMPLATE_FIELD,
            options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS,
        }, {
            type: DIVIDER_FIELD
        }, {
            key: "birthday_wish_email",
            initialValue: this.state.data ? this.state.data.birthday_wish_email : false,
            type: SINGLE_CHECKBOX_FIELD,
            follow: <b>BIRTHDAY WISH EMAIL</b>,
            extra: "Email is sent to the Patient on the morning of their birthday"
        }, {
            key: "birthday_wish_email_text",
            initialValue: this.state.data ? this.state.data.birthday_wish_email_text : '',
            type: MAIL_TEMPLATE_FIELD,
            options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS,
        }, {
            type: DIVIDER_FIELD
        }, {
            key: "lab_order_confirmation_email",
            initialValue: this.state.data ? this.state.data.lab_order_confirmation_email : false,
            type: SINGLE_CHECKBOX_FIELD,
            follow: <b>LAB ORDER CONFIRMATION EMAIL</b>,
            extra: "Email is sent to the Patient when he is prescribed a Lab Order"
        }, {
            key: "lab_order_confirmation_email_text",
            initialValue: this.state.data ? this.state.data.lab_order_confirmation_email_text : '',
            type: MAIL_TEMPLATE_FIELD,
            options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS,
        }, {
            type: DIVIDER_FIELD
        }, {
            key: "lab_order_due_date_email",
            initialValue: this.state.data ? this.state.data.lab_order_due_date_email : false,
            type: SINGLE_CHECKBOX_FIELD,
            follow: <b>LAB ORDER DUE DATE EMAIL</b>,
            extra: "Email is sent to the Patient when due date is entered for a Lab Order"
        }, {
            key: "lab_order_due_date_email_text",
            initialValue: this.state.data ? this.state.data.lab_order_due_date_email_text : '',
            type: MAIL_TEMPLATE_FIELD,
            options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS,
        }, {
            type: DIVIDER_FIELD
        }, {
            key: "lab_order_result_email",
            initialValue: this.state.data ? this.state.data.lab_order_result_email : false,
            type: SINGLE_CHECKBOX_FIELD,
            follow: <b>LAB ORDER RESULT EMAIL</b>,
            extra: "Email is sent to the Patient when result for a Lab Order is ready"
        }, {
            key: "alab_order_result_email_text",
            initialValue: this.state.data ? this.state.data.alab_order_result_email_text : '',
            type: MAIL_TEMPLATE_FIELD,
            options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS,
        }, {
            type: DIVIDER_FIELD
        }, {
            key: "anniversary_wish_email",
            initialValue: this.state.data ? this.state.data.anniversary_wish_email : false,
            type: SINGLE_CHECKBOX_FIELD,
            follow: <b>ANNIVERSARY WISH EMAIL</b>,
            extra: "Email is sent to the Patient on the morning of their anniversary"
        }, {
            key: "anniversary_wish_email_text",
            initialValue: this.state.data ? this.state.data.anniversary_wish_email_text : '',
            type: MAIL_TEMPLATE_FIELD,
            options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS,
        }];

        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "Communication Settings Saved Successfully!!");
                console.log("form",data);
            },
            errorFn: function () {

            },
            action: interpolate(EMAIL_COMMUNICATONS_API, [that.props.active_practiceId]),
            method: "post",
        };

        const defaultValues = [{"key": "practice", "value": this.props.active_practiceId, "is_active": false}, {
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

export default Emails;
