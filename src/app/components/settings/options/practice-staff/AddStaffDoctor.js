import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";

class AddStaffDoctor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: [{
                label: "Doctor Name",
                key: "practiceName",
                required: true,
                initialValue: "",
                type: INPUT_FIELD
            }, {
                label: "Mobile Number",
                key: "practiceTagline",
                required: true,
                initialValue: "",
                type: INPUT_FIELD
            },{
                label: "Email Id",
                key: "practiceName",
                required: true,
                initialValue: "",
                type: INPUT_FIELD
            }, {
                label: "Registration Number",
                key: "practiceName",
                required: true,
                initialValue: "",
                type: INPUT_FIELD
            },{
                label: "Calendar Colour",
                key: "name4",
                required: true,
                initialValue: "",
                type: SELECT_FIELD,
                options: [{label: "red", value: "red"}, {label: "blue", value: "blue"}, {label: "green", value: "green"}]
            },]
        }
    }

    render() {
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <Row>
            <Card>
                <TestFormLayout title="ADD DOCTOR " fields={this.state.fields}/>
            </Card>
        </Row>
    }
}

export default AddStaffDoctor;
