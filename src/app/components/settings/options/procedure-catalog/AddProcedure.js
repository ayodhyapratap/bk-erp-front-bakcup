import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form, Card  } from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD, NUMBER_FIELD} from "../../../../constants/dataKeys";

class AddProcedure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: [{
                label: "Procedure Name",
                key: "procedurename",
                required: true,
                type: INPUT_FIELD
            }, {
                label: "Procedure Cost",
                key: " procedurecost",
                follow: "INR",
                required: true,
                type: NUMBER_FIELD,
            },{
                label: "Applicable Taxes",
                key: "taxes",
                type: CHECKBOX_FIELD,
                options: [{label: "CGST", value: "cgst"}, {label: "SGST", value: "sgst"}, {label: "service tax", value: "service_tax"}]
            }, {
                label: "Add Under",
                key: "under",
                type: SELECT_FIELD,
                options: [{label: "None", value: "none"}, {label: "x", value: "13"}, {label: "y", value: "14"}]
            },{
                label: "Default Note",
                key: "note",
                type: INPUT_FIELD
            },]
        }
    }

    render() {
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
          <Card>
            <TestFormLayout title="Add Procedure" fields={this.state.fields}/>
          </Card>
        </div>
    }
}

export default AddProcedure;
