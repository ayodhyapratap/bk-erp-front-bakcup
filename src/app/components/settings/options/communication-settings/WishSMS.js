import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";

class WishSMS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: [{
                label: "Name 1",
                key: "name1",
                required: true,
                initialValue: "My Name",
                type: INPUT_FIELD
            }, {
                label: "Name 2",
                key: "name2",
                required: true,
                initialValue: "My Name",
                type: RADIO_FIELD,
                options: [{label: "Hello", value: "12"}, {label: "New", value: "13"}, {label: "World", value: "14"}]
            },{
                label: "Name 3",
                key: "name3",
                required: true,
                initialValue: "My Name",
                type: CHECKBOX_FIELD,
                options: [{label: "Hello", value: "12"}, {label: "New", value: "13"}, {label: "World", value: "14"}]
            }, {
                label: "Name 4",
                key: "name4",
                required: true,
                initialValue: "My Name",
                type: SELECT_FIELD,
                options: [{label: "Hello", value: "12"}, {label: "New", value: "13"}, {label: "World", value: "14"}]
            },]
        }
    }

    render() {
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
            <TestFormLayout title="Communication Settings" fields={this.state.fields}/>
        </div>
    }
}

export default WishSMS;
