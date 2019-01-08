import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form , Card} from "antd";
import {CHECKBOX_FIELD, SUCCESS_MSG_TYPE,  TEXT_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {COMMUNICATONS_API} from "../../../../constants/api"
import { Redirect } from 'react-router-dom'
import {getAPI, displayMessage, interpolate} from "../../../../utils/common";


class AppointmentSMS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          redirect: false,
          data:null,

        }
        this.loadData = this.loadData.bind(this);

    }
    componentDidMount(){
      this.loadData();
    }
    loadData(){
      var that = this;
        let successFn = function (data) {
          console.log("get table");
          that.setState({
            data:data[0],
          })
        };
        let errorFn = function () {
        };
       getAPI(interpolate( COMMUNICATONS_API, [this.props.active_practiceId]), successFn, errorFn);
    }

    changeRedirect(){
      var redirectVar=this.state.redirect;
    this.setState({
      redirect:  !redirectVar,
    })  ;
    }

    render() {

      console.log(this.state.data);
      const   fields= [{
            label: "Contact Number",
            key: "contact_number",
            initialValue: this.state.data?this.state.data.contact_number:null,
            extra:"Maximum 15 characters & represented as {{CLINICCONTACTNUMBER}}",
            type: INPUT_FIELD
        },{
            label: "Email",
            key: "email",
            initialValue:  this.state.data?this.state.data.email:null,
            extra: "All replies by Patients for emails will be sent to this address",
            type: INPUT_FIELD
        },{
            label: "SMS Language",
            key: "sms_language",
            initialValue:  this.state.data?this.state.data.sms_language:null,
            extra: "SMS to Patients will be sent in this language",
            type: INPUT_FIELD
        },{
            label: "SMS clinic Name",
            key: "sms_clinic_name",
            initialValue: this.state.data?this.state.data.sms_clinic_name:null,
            extra: "{{CLINIC}} will use this name.",
            type: INPUT_FIELD,
        },{
            key: "appointment_confirmation_sms",
        //    initialValue:  this.state.data?[this.state.data.appointment_confirmation_sms]:null,
            type: CHECKBOX_FIELD,
            extra:"SMS is sent to the Patient on successfully adding an appointment",
            options: [{label: " APPOINTMENT CONFIRMATION SMS", value: true}]
        },{
            key: "appointment_confirmation_text",
          initialValue:  this.state.data?this.state.data.appointment_confirmation_text:null,

            minRows: 4,
            disabled:true,
            type: TEXT_FIELD,

        },{
            key: "appointment_cancellation_sms",
          //  initialValue: this.state.data?[this.state.data.appointment_cancellation_sms]:null,
            type: CHECKBOX_FIELD,
            extra:"SMS is sent to the Patient when the appointment is cancelled",
            options: [{label: "appointment_cancellation_sms", value: "true"}]
        },{
            key: "appointment_cancellation_text",
            initialValue: this.state.data?this.state.data.appointment_cancellation_text:null,
            minRows: 4,
            disabled:true,
            type: TEXT_FIELD,

        },{
            label:" ",
            key: "appointment_reminder_sms",
      //    initialValue:  this.state.data?this.state.data.sms_language:null,
            type: CHECKBOX_FIELD,
            extra: "This SMS is automatically sent to the Patient at selected time & date before the appointment.",
            options: [{label: "appointment_reminder_sms", value: "12"}]
        },{
            key: "appointment_reminder_text",
            initialValue:  this.state.data?this.state.data.appointment_reminder_text:null,
            minRows: 4,
            disabled:true,
            type: TEXT_FIELD,

        },{
            key: "send_on_day_of_appointment",
          //  initialValue:  this.state.data?this.state.data.sms_language:null,
            type: CHECKBOX_FIELD,
            options: [{label: "send_on_day_of_appointment", value: "12"}]
        },{
            key: "send_on_day_of_appointment_time",
            initialValue: "send_on_day_of_appointment_time",
            extra:" Send reminder SMS on the day of appointment at",
            type: INPUT_FIELD,
        },{
            key: "follow_up_reminder_sms",
        //  initialValue:  this.state.data?this.state.data.sms_language:null,
            type: CHECKBOX_FIELD,
            extra:"This SMS is sent to the Patient on the morning of the followup sms.",
            options: [{label: "follow_up_reminder_sms", value: "12"}]
        },{
            key: "follow_up_reminder_sms_text",
            initialValue:  this.state.data?this.state.data.follow_up_reminder_sms_text:null,
            minRows: 4,
            disabled:true,
            type: TEXT_FIELD,

        },{
            key: "send_follow_up_reminder_time",
            initialValue:  this.state.data?this.state.data.send_follow_up_reminder_time:null,
            extra:"Send follow-up SMS   after the last appointment.",
            type: INPUT_FIELD,
        },{
            key: "payment_sms",
            //initialValue:  this.state.data?this.state.data.payment_sms:null,
            type: CHECKBOX_FIELD,
            extra:"This SMS is sent to the Patient when payment is received.",
            options: [{label: "payment_sms", value: "12"}]
        },{
            key: "payment_sms_text",
            initialValue:  this.state.data?this.state.data.payment_sms_text:null,
            disabled:true,
            minRows:4,
            type: TEXT_FIELD,
        },{
            key: "lab_order_confirmation_sms",
          //  initialValue:  this.state.data?this.state.data.sms_language:null,
            type: CHECKBOX_FIELD,
            extra:"This SMS is sent to the Patient when he is prescribed a lab order.",
            options: [{label: "lab_order_confirmation_sms", value: "12"}]
        },
        {
            key: "lab_order_confirmation_text",
            initialValue:  this.state.data?this.state.data.lab_order_confirmation_text:null,
            minRows: 4,
            disabled:true,
            type: TEXT_FIELD,

        },{
          label:"",
            key: "lab_order_due_on_sms",
          //  initialValue:  this.state.data?this.state.data.sms_language:null,
            extra:"This SMS is sent to the Patient informing lab order due date",
            type: CHECKBOX_FIELD,
            options: [{label: "lab_order_due_on_sms", value: "12"}]
        },{
            key: "lab_order_result_sms",
          //  initialValue:  this.state.data?this.state.data.sms_language:null,
            extra:"This SMS is sent to the Patient when lab order results are ready",
            type: CHECKBOX_FIELD,
            options: [{label: "lab_order_result_sms", value: "12"}]
        },{
            key: "lab_order_reminder_sms",
          //  initialValue:  this.state.data?this.state.data.sms_language:null,
            type: CHECKBOX_FIELD,
            extra:"This reminder SMS is sent to the Patient",
            options: [{label: "lab_order_reminder_sms", value: "12"}]
        },];
        const formProp={
          successFn:function(data){
            displayMessage(SUCCESS_MSG_TYPE, "success");
            console.log(data);
          },
          errorFn:function(){

          },
          action: "x",
          method: "post",
        };
        const defaultValues = [{"key":"practice", "value":this.props.active_practiceId}, {"key":"id", "value":this.state.data?this.state.data.id:null,}];

        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
            <TestFormLayout formProp={formProp} defaultValues={defaultValues}  title="Communication Settings" fields={fields}/>
        </div>
    }
}

export default AppointmentSMS;
