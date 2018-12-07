import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import {ALL_PRACTICE_STAFF} from "../../../../constants/api";

class AddStaffDoctor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: [
              {
                  label: "clinic admin",
                  key: "user",
                  required: true,
                  initialValue: 3,
                  type: INPUT_FIELD
              },{
                  label: "clinic Name",
                  key: "practice",
                  required: true,
                  initialValue: 2,
                  type: INPUT_FIELD
              },{
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
            },{
                label: "Calendar Colour",
                key: "calender_colour",
                required: true,
                initialValue: "",
                type: SELECT_FIELD,
                options: [{label: "red", value: "red"}, {label: "blue", value: "blue"}, {label: "green", value: "green"}]
            },]
        }
    }

    render() {
              const formProp={
                successFn:function(data){

                  console.log(data);
                },
                errorFn:function(){

                },
                action: ALL_PRACTICE_STAFF,
                method: "post",
              }
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <Row>
            <Card>
                <TestFormLayout title="ADD DOCTOR "  formProp ={formProp} fields={this.state.fields}/>
            </Card>
        </Row>
    }
}

export default AddStaffDoctor;
