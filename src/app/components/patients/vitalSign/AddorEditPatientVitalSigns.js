import React from "react";
import {Route} from "react-router";

import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {CHECKBOX_FIELD, DATE_PICKER, NUMBER_FIELD,  SUCCESS_MSG_TYPE, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../constants/dataKeys";
import {ADD_VITAL_SIGN, PATIENT_PROFILE} from "../../../constants/api";
import {getAPI,interpolate, displayMessage} from "../../../utils/common";
import { Redirect } from 'react-router-dom'
import moment from 'moment';



class AddorEditPatientVitalSigns extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          redirect:false,
          vitalSign:null,

        }
        this.changeRedirect= this.changeRedirect.bind(this);
        console.log("Working or not");

    }


      changeRedirect(){
        var redirectVar=this.state.redirect;
      this.setState({
        redirect:  !redirectVar,
      })  ;
      }

    render() {
      console.log(this.props.currentPatient);
      const  fields= [ {
            label: "pulse",
            key: "pulse",
            required: true,
            //initialValue:this.props.currentPatient?this.props.currentPatient.addhar_id:null,
            type: INPUT_FIELD
        },{
            label: "temperature",
            key: "temperature",
          //  initialValue:this.props.currentPatient?this.props.currentPatient.blood_group:null,
            type: INPUT_FIELD
        },{
            label: "temperature_part",
            key: "temperature_part",
            type: SELECT_FIELD,
            //initialValue:this.props.currentPatient?this.props.currentPatient.gender:null,
            options: [{label: "forehead", value: "forehead"}, {label: "armpit", value: "armpit"}, {label: "oral ", value: "oral"}]
        },{
            label: "blood_pressure",
            key: "blood_pressure",
          //  initialValue:this.props.currentPatient?this.props.currentPatient.family_relation:null,
            type: INPUT_FIELD,
        },{
            label: "position",
            key: "position",
            type: SELECT_FIELD,
            //initialValue:this.props.currentPatient?this.props.currentPatient.gender:null,
            options: [{label: "standing", value: "standing"}, {label: "sitting", value: "sitting"}]
        },  {
            label: "weight",
            key: "weight",
        //    initialValue:this.props.currentPatient?this.props.currentPatient.primary_mobile_no:null,
            type: INPUT_FIELD,
        }, {
            label: "resp_rate",
            key: "resp_rate",
        //    initialValue:this.props.currentPatient?this.props.currentPatient.secondary_mobile_no:null,
            type: INPUT_FIELD,
        },];


        let editformProp;
        const TestFormLayout = Form.create()(DynamicFieldsForm);
        // if(this.props.currentPatient){
        //    editformProp={
        //     successFn:function(data){
        //       displayMessage(SUCCESS_MSG_TYPE, "success")
        //
        //       console.log(data);
        //     },
        //     errorFn:function(){
        //
        //     },
        //     action: interpolate(PATIENT_PROFILE, [this.props.currentPatient.id]),
        //     method: "put",
        //   }
        // }
          const formProp={
            successFn:function(data){
              displayMessage(SUCCESS_MSG_TYPE, "success")

              console.log(data);
            },
            errorFn:function(){

            },
            action:  interpolate(ADD_VITAL_SIGN, [this.props.match.params.id]),
            method: "post",
          }

          const defaultValues = [{"key":"id", "value":[this.state.vitalsign]}];

          return <Row>
                <Card>
                  <Route exact path='/patient/:id/emr/vitalsigns/edit'
                        render={() => (this.state.vitalsign? <TestFormLayout  defaultValues={defaultValues}  title="Edit vital sign" changeRedirect= {this.changeRedirect} formProp= {formProp} fields={fields}/>:<Redirect to='/patients/profile' />)}/>
                  <Route exact path='/patient/:id/emr/vitalsigns/add'
                        render={() =><TestFormLayout title="Add vital sign" changeRedirect= {this.changeRedirect} formProp= {formProp} fields={fields}/>}/>


                </Card>
                {this.state.redirect&&    <Redirect to={'/patient/'+this.props.match.params.id+'/emr/vitalsigns'} />}
            </Row>

    }
}

export default AddorEditPatientVitalSigns;
