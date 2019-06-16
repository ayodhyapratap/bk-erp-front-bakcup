import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form} from "antd";
import {SMS_FIELD, SUCCESS_MSG_TYPE, SINGLE_CHECKBOX_FIELD} from "../../../../constants/dataKeys";
import {APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS} from "../../../../constants/hardData";
import {displayMessage, interpolate} from "../../../../utils/common";
import {COMMUNICATONS_API} from "../../../../constants/api";


class WishSMS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        let that = this;
        const fields = [{
            key: "birthday_wish_sms",
            // initialValue: this.state.data ? this.state.data.appointment_confirmation_sms : false,
            type: SINGLE_CHECKBOX_FIELD,
            extra: "This SMS is sent to the Patient on the morning of their birthday",
            follow: <b>BIRTHDAY WISH SMS</b>
        }, {
            key: "birthday_wish_text",
            placeholder: "{clinic}{patient}}",
            // initialValue: this.state.data ? this.state.data.appointment_confirmation_text : null,
            minRows: 4,
            type: SMS_FIELD,
            options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS,

        }, {
            key: "anniversary_wish_sms",
            // initialValue: this.state.data ? this.state.data.appointment_confirmation_sms : false,
            type: SINGLE_CHECKBOX_FIELD,
            extra: "This SMS is sent to the Patient on the morning of their anniversary",
            follow: <b>ANNIVERSARY WISH SMS</b>
        }, {
            key: "anniversary_wish_text",
            placeholder: "{anniversary}",
            minRows: 4,
            type: SMS_FIELD,
            options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS
        }, {
            key: "online_appointment_sms",
            type: SINGLE_CHECKBOX_FIELD,
            extra: "This SMS is sent to the Patient when they request an appointment on your practice marketing page",
            follow: <b>ONLINE APPOINTMENT SMS</b>
        }, {
            key: "online_appointment_text",
            placeholder: "{online appointment}",
            minRows: 4,
            type: SMS_FIELD,
            options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS
        }];
        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success");
            },
            errorFn: function () {

            },
            action: interpolate(COMMUNICATONS_API, [that.props.active_practiceId]),
            method: "post",
        };
        const defaultValues = [{"key": "practice", "value": this.props.active_practiceId}];

        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
            <TestFormLayout formProp={formProp} defaultValues={defaultValues}
                            fields={fields}/>
        </div>
    }
}

export default WishSMS;
