import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form} from "antd";
import { SMS_FIELD, SUCCESS_MSG_TYPE, SINGLE_CHECKBOX_FIELD} from "../../../../constants/dataKeys";
import {APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS} from "../../../../constants/hardData";
import {displayMessage, interpolate} from "../../../../utils/common";
class WishSMS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }

    render() {
        let that=this;
        console.log("Propsssssssss",this.props);
        const fields=[{
            key: "birthday",
            // initialValue: this.state.data ? this.state.data.appointment_confirmation_sms : false,
            type: SINGLE_CHECKBOX_FIELD,
            extra: "This SMS is sent to the Patient on the morning of their birthday",
            follow: <b>BIRTHDAY WISH SMS</b>
        },{
            key: "birthday_sms",
            placeholder:"{clinic}{patient}}",
            // initialValue: this.state.data ? this.state.data.appointment_confirmation_text : null,
            minRows: 4,
            type: SMS_FIELD,
            options: APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS,
            
        }, {
            key: "anniversary",
            // initialValue: this.state.data ? this.state.data.appointment_confirmation_sms : false,
            type: SINGLE_CHECKBOX_FIELD,
            extra: "This SMS is sent to the Patient on the morning of their anniversary",
            follow: <b>ANNIVERSARY WISH SMS</b>
        },{
            key:"anniversary_sms",
            placeholder:"{anniversary}",
            minRows:4,
            type:SMS_FIELD,
            options:APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS
        }, {
            key:"online appointment",
            type:SINGLE_CHECKBOX_FIELD,
            extra:"This SMS is sent to the Patient when they request an appointment on your practice marketing page",
            follow:<b>ONLINE APPOINTMENT SMS</b>
        }, {
           key:"onlineAppointment_sms",
           placeholder:"{online appointment}",
           minRows:4,
           type:SMS_FIELD,
           options:APPOINTMENT_CONFIRMATION_SMS_TAG_OPTIONS
        }];
        const formProp = {
            successFn: function (data) {
                displayMessage(SUCCESS_MSG_TYPE, "success");
            },
            errorFn: function () {

            },
            // action: interpolate(COMMUNICATONS_API, [that.props.active_practiceId]),
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
