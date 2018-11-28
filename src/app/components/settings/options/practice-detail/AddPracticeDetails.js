import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";

class AddPracticeDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: [{
                label: "Practice Name",
                key: "practiceName",
                required: true,
                initialValue: "My Name",
                type: INPUT_FIELD
            }, {
                label: "Practice Tagline",
                key: "practiceTagline",
                required: true,
                initialValue: "My Name",
                type: INPUT_FIELD
            }, {
                label: "Practice Specialisation",
                key: "name4",
                required: true,
                initialValue: "My Name",
                type: SELECT_FIELD,
                options: [{label: "Hello", value: "12"}, {label: "New", value: "13"}, {label: "World", value: "14"}]
            }, {
                label: "Practice Street Address",
                key: "practiceName",
                required: true,
                initialValue: "My Name",
                type: INPUT_FIELD
            }, {
                label: "Practice City",
                key: "practiceName",
                required: true,
                initialValue: "My Name",
                type: INPUT_FIELD
            }, {
                label: "Practice state",
                key: "name4",
                required: true,
                initialValue: "My Name",
                type: SELECT_FIELD,
                options: [{label: "Hello", value: "12"}, {label: "New", value: "13"}, {label: "World", value: "14"}]
            }, {
                label: "Practice Country",
                key: "name4",
                required: true,
                initialValue: "My Name",
                type: SELECT_FIELD,
                options: [{label: "Hello", value: "12"}, {label: "New", value: "13"}, {label: "World", value: "14"}]
            }, {
                label: "Practice PINCODE",
                key: "practiceName",
                required: true,
                initialValue: "My Name",
                type: INPUT_FIELD
            }, {
                label: "Practice Contact Number",
                key: "practiceName",
                required: true,
                initialValue: "My Name",
                type: INPUT_FIELD
            }, {
                label: "Practice Email",
                key: "practiceName",
                required: true,
                initialValue: "My Name",
                type: INPUT_FIELD
            }, {
                label: "Practice website",
                key: "practiceName",
                required: true,
                initialValue: "My Name",
                type: INPUT_FIELD
            }, {
                label: "Timezone",
                key: "name4",
                required: true,
                initialValue: "My Name",
                type: SELECT_FIELD,
                options: [{label: "Hello", value: "12"}, {label: "New", value: "13"}, {label: "World", value: "14"}]
            }, {
                label: "GSTIN",
                key: "practiceName",
                required: true,
                initialValue: "My Name",
                type: INPUT_FIELD
            },]
        }
    }

    render() {
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <Row>
            <Card>
                <TestFormLayout title="Practice Details" fields={this.state.fields}/>
            </Card>
        </Row>
    }
}

export default AddPracticeDetails;
