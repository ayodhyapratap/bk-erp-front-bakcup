import React from "react";
import {Route} from "react-router";

import DynamicFieldsForm from "../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {CHECKBOX_FIELD, SINGLE_CHECKBOX_FIELD, DATE_PICKER, NUMBER_FIELD,  SUCCESS_MSG_TYPE, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../constants/dataKeys";
import {PATIENTS_LIST,  ALL_APPOINTMENT_API} from "../../constants/api";
import {getAPI,interpolate, displayMessage} from "../../utils/common";
import { Redirect } from 'react-router-dom'
import moment from 'moment';


class CreateAppointment extends React.Component{
  constructor(props) {
      super(props);

      this.state = {
        redirect:false,

      }
      this.changeRedirect= this.changeRedirect.bind(this);

  }
  componentDidMount(){
  }

  changeRedirect(){
    var redirectVar=this.state.redirect;
      this.setState({
        redirect:  !redirectVar,
      })  ;
  }
  render(){
    const fields= [ {
        label: "shedule_at",
        key: "shedule_at",
        type: DATE_PICKER,
        initialValue:this.props.startTime,
        format:"YYYY/MM/DD HH:mm"
    },{
        label: "Time Slot",
        key: "slot",
        follow: "mins",
        initialValue:10,
        type: NUMBER_FIELD,
    },{
        label: "Patient Name",
        key: "patient_name",
        required: true,
        type: INPUT_FIELD
    },{
        label: "Patient Id",
        key: "patient_id",
        required: true,
        type: INPUT_FIELD
    },{
        label: "Mobile Number",
        key: "patient_mobile",
        required: true,
        type: INPUT_FIELD
    },{
        label: "Email Address",
        key: "email",
        required: true,
        type: INPUT_FIELD
    },{
        label: "Notify Patient",
        key: "notify_via_sms",
        type: SINGLE_CHECKBOX_FIELD,
        follow: "Via SMS"
    }, {
        label: "Notify Patient",
        key: "notify_via_email",
        type: SINGLE_CHECKBOX_FIELD,
        follow: "Via Email"
    }, {
        label: "Doctor",
        key: "doctor",
        required: true,
        type: SELECT_FIELD,
        options: [{label: "Hello", value: "10"}, {label: "New", value: "12"}, {label: "World", value: "14"}]
    },{
        label: "Category",
        key: "category",
        required: true,
        type: SELECT_FIELD,
        options: [{label: "Hello", value: "1"}, {label: "New", value: "3"}, {label: "World", value: "4"}]
    },{
        label: "Procedures Planned",
        key: "procedure",
        required: true,
        type: SELECT_FIELD,
        options: [{label: "Hello", value: "1"}, {label: "New", value: "3"}, {label: "World", value: "4"}]
    },{
        label: "Notes",
        key: "notes",
        required: true,
        type: SELECT_FIELD,
        options: [{label: "Hello", value: "1"}, {label: "New", value: "3"}, {label: "World", value: "4"}]
    },];
    const formProp={
      successFn:function(data){
        console.log(data);
        displayMessage(SUCCESS_MSG_TYPE, "success")

      },
      errorFn:function(){

      },
      action: ALL_APPOINTMENT_API,
      method: "post",
    };
    const defaultValues = [{"key":"practice", "value":this.props.active_practiceId}];
    const TestFormLayout = Form.create()(DynamicFieldsForm);
      return <Card>
   <TestFormLayout title="add Patient" changeRedirect= {this.changeRedirect} defaultValues={defaultValues}  formProp= {formProp} fields={fields}/>
      </Card>
  }

}

export default CreateAppointment;
