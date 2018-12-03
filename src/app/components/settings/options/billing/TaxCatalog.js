import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row, Table, Divider} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, NUMBER_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";

class TaxCatalog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: [{
                label: "Tax name",
                key: "tax_name",
                required: true,
                type: INPUT_FIELD
            },{
                label: "Tax Value",
                key: "tax_value",
                follow: "INR",
                required: true,
                type: NUMBER_FIELD
          },]
        }
    }

    render() {
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
            <TestFormLayout  fields={this.state.fields}/>
            <Divider/>
            <Table>
            </Table>
        </div>
    }
}

export default TaxCatalog;
