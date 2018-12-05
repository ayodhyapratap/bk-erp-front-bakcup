import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form, Card, message  } from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD, NUMBER_FIELD} from "../../../../constants/dataKeys";
import {PROCEDURE_CATEGORY} from "../../../../constants/api"
import {getAPI, interpolate} from "../../../../utils/common";

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
      const formProp={
        successFn:function(data){
           message.success(data);
          console.log(data);
        },
        errorFn:function(){

        },
        action: interpolate(PROCEDURE_CATEGORY,[2]),
        method: "post",
      }

        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div>
          <Card>
            <TestFormLayout title="Add Procedure"  formProp={formProp} fields={this.state.fields}/>
          </Card>
        </div>
    }
}

export default AddProcedure;
