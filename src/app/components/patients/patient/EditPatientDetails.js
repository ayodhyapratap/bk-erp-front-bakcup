import React from "react";
import {Route} from "react-router";

import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {CHECKBOX_FIELD, DATE_PICKER, NUMBER_FIELD,  SUCCESS_MSG_TYPE, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../constants/dataKeys";
import {PATIENTS_LIST, PATIENT_PROFILE} from "../../../constants/api";
import {getAPI,interpolate, displayMessage} from "../../../utils/common";
import { Redirect } from 'react-router-dom'
import moment from 'moment';



class EditPatientDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          redirect:false,

        }
        this.changeRedirect= this.changeRedirect.bind(this);
        console.log("Working or not");

    }
    componentDidMount(){
    }


      changeRedirect(){
        var redirectVar=this.state.redirect;
      this.setState({
        redirect:  !redirectVar,
      })  ;
      }

    render() {
      console.log(this.props.currentPatient);
      const  fields= [{
            label: "Patient Name",
            key: "name",
            required: true,
            initialValue:this.props.currentPatient?this.props.currentPatient.name:null,
            type: INPUT_FIELD
        }, {
            label: "patient_id",
            key: "patient_id",
            required: true,
            initialValue:this.props.currentPatient?this.props.currentPatient.patient_id:null,
            type: INPUT_FIELD
        }, {
            label: "addhar_id",
            key: "addhar_id",
            required: true,
            initialValue:this.props.currentPatient?this.props.currentPatient.addhar_id:null,
            type: INPUT_FIELD
        },{
            label: "gender",
            key: "gender",
            type: SELECT_FIELD,
            initialValue:this.props.currentPatient?this.props.currentPatient.gender:null,
            options: [{label: "Male", value: "male"}, {label: "female", value: "female"}, {label: "other", value: "other"}]
        }, {
            label: "dob",
            key: "dob",
            initialValue:this.props.currentPatient?moment(this.props.currentPatient.dob):null,
            type: DATE_PICKER
        },
        {
            label: "anniversary",
            key: "anniversary",
            initialValue:this.props.currentPatient?moment(this.props.currentPatient.anniversary):null,
            type: DATE_PICKER
        }, {
            label: "blood_group",
            key: "blood_group",
            initialValue:this.props.currentPatient?this.props.currentPatient.blood_group:null,
            type: INPUT_FIELD
        }, {
            label: "age",
            key: "age",
            initialValue:this.props.currentPatient?this.props.currentPatient.age:null,
            type: NUMBER_FIELD
        }, {
            label: "family_relation",
            key: "family_relation",
            initialValue:this.props.currentPatient?this.props.currentPatient.family_relation:null,
            type: INPUT_FIELD,
        }, {
            label: "primary_mobile_no",
            key: "primary_mobile_no",
            initialValue:this.props.currentPatient?this.props.currentPatient.primary_mobile_no:null,
            type: INPUT_FIELD,
        }, {
            label: "secondary_mobile_no",
            key: "secondary_mobile_no",
            initialValue:this.props.currentPatient?this.props.currentPatient.secondary_mobile_no:null,
            type: INPUT_FIELD,
        }, {
            label: "landline_no",
            key: "landline_no",
            initialValue:this.props.currentPatient?this.props.currentPatient.landline_no:null,
            type: INPUT_FIELD,
        }, {
            label: "address",
            key: "address",
            initialValue:this.props.currentPatient?this.props.currentPatient.address:null,
            type: INPUT_FIELD,
        }, {
            label: "locality",
            key: "locality",
            initialValue:this.props.currentPatient?this.props.currentPatient.locality:null,
            type: INPUT_FIELD,
        },{
            label: "city",
            key: "city",
            initialValue:this.props.currentPatient?this.props.currentPatient.city:null,
            type: INPUT_FIELD
        },  {
            label: "PINCODE",
            key: "pincode",
            initialValue:this.props.currentPatient?this.props.currentPatient.pincode:null,
            type: INPUT_FIELD
        }, {
            label: "Email",
            key: "email",
            initialValue:this.props.currentPatient?this.props.currentPatient.email:null,
            type: INPUT_FIELD
        },];


        let editformProp;
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        if(this.props.currentPatient){
           editformProp={
            successFn:function(data){
              displayMessage(SUCCESS_MSG_TYPE, "success")

              console.log(data);
            },
            errorFn:function(){

            },
            action: interpolate(PATIENT_PROFILE, [this.props.currentPatient.id]),
            method: "put",
          }
        }
          const newformProp={
            successFn:function(data){
              displayMessage(SUCCESS_MSG_TYPE, "success")

              console.log(data);
            },
            errorFn:function(){

            },
            action: PATIENTS_LIST,
            method: "post",
          }

          return <Row>
                <Card>
                  <Route exact path='/patients/profile/edit'
                        render={() => (this.props.currentPatient? <TestFormLayout title="Edit Patient" changeRedirect= {this.changeRedirect} formProp= {editformProp} fields={fields}/>:<Redirect to='/patients/profile' />)}/>
                  <Route exact path='/patients/profile/add'
                        render={() =><TestFormLayout title="Add Patient" changeRedirect= {this.changeRedirect} formProp= {newformProp} fields={fields}/>}/>


                </Card>
                {this.state.redirect&&    <Redirect to='/patients/profile' />}
            </Row>

    }
}

export default EditPatientDetails;
