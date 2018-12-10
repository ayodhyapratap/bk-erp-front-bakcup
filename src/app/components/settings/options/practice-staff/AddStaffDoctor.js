import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {CHECKBOX_FIELD,SUCCESS_MSG_TYPE, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {ALL_PRACTICE_STAFF} from "../../../../constants/api";
import {getAPI, displayMessage, interpolate} from "../../../../utils/common";
import { Redirect } from 'react-router-dom'

class AddStaffDoctor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          redirect:false,
            fields: [
          {
                label: "Doctor Name",
                key: "name",
                required: true,
                initialValue: "",
                type: INPUT_FIELD
            }, {
                label: "Mobile Number",
                key: "mobile",
                required: true,
                initialValue: "",
                type: INPUT_FIELD
            },{
                label: "Email Id",
                key: "email",
                required: true,
                initialValue: "",
                type: INPUT_FIELD
            }, {
                label: "Registration Number",
                key: "registration_number",
                required: true,
                initialValue: "",
                type: INPUT_FIELD
            },
            {
                label: "Role",
                key: "role",
                required: true,
                initialValue: "",
                type: SELECT_FIELD,
                options: [{label: "Doctor", value: [1]}, {label: "Staff", value: [2]}, {label: "Frontdesk", value: [3]}]
            },{
                label: "Calendar Colour",
                key: "calender_colour",
                required: true,
                initialValue: "",
                type: SELECT_FIELD,
                options: [{label: "red", value: "red"}, {label: "blue", value: "blue"}, {label: "green", value: "green"}]
            },]
        }
        this.changeRedirect= this.changeRedirect.bind(this);

    }
    changeRedirect(){
      var redirectVar=this.state.redirect;
    this.setState({
      redirect:  !redirectVar,
    })  ;
    }
    render() {
              const formProp={
                successFn:function(data){
                  displayMessage(SUCCESS_MSG_TYPE, "success");
                  console.log(data);
                },
                errorFn:function(){

                },
                action: ALL_PRACTICE_STAFF,
                method: "post",
              }
        const defaultValues = [{"key":"practice", "value":this.props.active_practiceId}]

        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <Row>
            <Card>
                <TestFormLayout defaultValues={defaultValues}  changeRedirect= {this.changeRedirect} title="ADD DOCTOR "  formProp ={formProp} fields={this.state.fields}/>
            </Card>
            {this.state.redirect&&    <Redirect to='/settings/clinics-staff' />}

        </Row>
    }
}

export default AddStaffDoctor;
