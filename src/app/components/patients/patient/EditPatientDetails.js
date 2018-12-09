import React from "react";
import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {CHECKBOX_FIELD, DATE_PICKER, SUCCESS_MSG_TYPE, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../constants/dataKeys";
import {PATIENTS_LIST} from "../../../constants/api";
import {getAPI, displayMessage} from "../../../utils/common";
import { Redirect } from 'react-router-dom'



class EditPatientDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          redirect:false,
        }
        this.changeRedirect= this.changeRedirect.bind(this);
        console.log("Working or no>");

    }


      changeRedirect(){
        var redirectVar=this.state.redirect;
      this.setState({
        redirect:  !redirectVar,
      })  ;
      }

    render() {
      const  fields= [{
            label: "Practice Name",
            key: "name",
            required: true,
            type: INPUT_FIELD
        }, {
            label: "patient_id",
            key: "patient_id",
            required: true,
            type: INPUT_FIELD
        }, {
            label: "addhar_id",
            key: "addhar_id",
            required: true,
            type: INPUT_FIELD
        },         {
            label: "gender",
            key: "gender",
            type: SELECT_FIELD,
            options: [{label: "Male", value: "male"}, {label: "female", value: "female"}, {label: "other", value: "other"}]
        }, {
            label: "dob",
            key: "dob",
            type: DATE_PICKER
        },
        {
            label: "anniversary",
            key: "anniversary",
            type: DATE_PICKER
        }, {
            label: "blood_group",
            key: "blood_group",
            type: INPUT_FIELD
        }, {
            label: "age",
            key: "age",
            type: NUMBER_FIELD
        }, {
            label: "family_relation",
            key: "family_relation",
            type: INPUT_FIELD,
        }, {
            label: "primary_mobile_no",
            key: "primary_mobile_no",
            type: INPUT_FIELD,
        }, {
            label: "secondary_mobile_no",
            key: "secondary_mobile_no",
            type: INPUT_FIELD,
        }, {
            label: "landline_no",
            key: "landline_no",
            type: INPUT_FIELD,
        }, {
            label: "address",
            key: "address",
            type: INPUT_FIELD,
        }, {
            label: "locality",
            key: "locality",
            type: INPUT_FIELD,
        },{
            label: "city",
            key: "city",
            type: INPUT_FIELD
        },  {
            label: "PINCODE",
            key: "pincode",
            type: INPUT_FIELD
        }, {
            label: "Email",
            key: "email",
            type: INPUT_FIELD
        }, {
            label: "Practice ",
            key: "practice",
            type: INPUT_FIELD
        },];

        const formProp={
          successFn:function(data){
            displayMessage(SUCCESS_MSG_TYPE, "success")

            console.log(data);
          },
          errorFn:function(){

          },
          action: PATIENTS_LIST,
          method: "post",
        }

        const TestFormLayout = Form.create()(DynamicFieldsForm);
        if(this.props.currentPatient){
          return <Row>
              <Card>
                  <TestFormLayout title="Edit Patient" changeRedirect= {this.changeRedirect} formProp= {formProp} fields={fields}/>
              </Card>
              {this.state.redirect&&    <Redirect to='/patients/profile' />}
          </Row>
        }

        return  <Redirect to='/patients/profile' />

    }
}

export default EditPatientDetails;
