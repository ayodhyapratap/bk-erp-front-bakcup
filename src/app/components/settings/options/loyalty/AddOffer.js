import React from "react";
import DynamicFieldsForm from "../../../common/DynamicFieldsForm";
import {Form, Card, message} from "antd";
import {CHECKBOX_FIELD, INPUT_FIELD, RADIO_FIELD, NUMBER_FIELD, SELECT_FIELD} from "../../../../constants/dataKeys";
import { OFFERS} from "../../../../constants/api";
import {getAPI, deleteAPI, interpolate} from "../../../../utils/common";
import { Redirect } from 'react-router-dom'


class AddOffer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          redirect:false,
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
                key: "description",
                required: true,
                type: INPUT_FIELD
            },{
                label: "Discount",
                key: "discount",
                required: true,
                type: NUMBER_FIELD,
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
          console.log(data);
        },
        errorFn:function(){

        },
        action: interpolate(OFFERS,[2]),
        method: "post",
      }
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        return <div><Card>
            <TestFormLayout title="Add Offer" formProp={formProp}  changeRedirect={this.changeRedirect} fields={this.state.fields}/>
            {this.state.redirect&&    <Redirect to='/settings/loyalty' />}

            </Card>
        </div>
    }
}

export default AddOffer;
