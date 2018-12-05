import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form, Card, message} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, NUMBER_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import { OFFERS} from "../../../../constants/api";
import {getAPI, deleteAPI, interpolate} from "../../../../utils/common";

class AddOffer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fields: [{
                label: "practice ",
                key: "practice",
                initialValue:"2",
                required: true,
                type: INPUT_FIELD
            },{
                label: "Offer Name ",
                key: "code",
                required: true,
                type: INPUT_FIELD
            },{
                label: "Description ",
                key: "name1",
                required: true,
                type: INPUT_FIELD
            },{
                label: "Discount",
                key: "name4",
                required: true,
                type: NUMBER_FIELD,
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
        action: interpolate(OFFERS,[2]),
        method: "post",
      }
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div><Card>
            <TestFormLayout title="Add Offer" formProp={formProp} fields={this.state.fields}/>
            </Card>
        </div>
    }
}

export default AddOffer;
