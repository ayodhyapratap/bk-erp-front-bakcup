import React from "react";
import {Route} from "react-router";

import DynamicFieldsForm from "../../common/DynamicFieldsForm";
import {Button, Card, Form, Icon, Row} from "antd";
import {CHECKBOX_FIELD, DATE_PICKER, NUMBER_FIELD,  SUCCESS_MSG_TYPE, INPUT_FIELD, RADIO_FIELD, SELECT_FIELD} from "../../../constants/dataKeys";
import {VITAL_SIGNS_API, PATIENT_PROFILE} from "../../../constants/api";
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
            label: "Pulse",
            key: "pulse",
            required: true,
            //initialValue:this.props.currentPatient?this.props.currentPatient.addhar_id:null,
            type: NUMBER_FIELD
        },{
            label: "Temperature",
            key: "temperature",
          //  initialValue:this.props.currentPatient?this.props.currentPatient.blood_group:null,
            type: INPUT_FIELD
        },{
            label: "Temperature Part",
            key: "temperature_part",
            type: SELECT_FIELD,
            //initialValue:this.props.currentPatient?this.props.currentPatient.gender:null,
            options: [{label: "forehead", value: "forehead"}, {label: "armpit", value: "armpit"}, {label: "oral ", value: "oral"}]
        },{
            label: "Blood Pressure",
            key: "blood_pressure",
          //  initialValue:this.props.currentPatient?this.props.currentPatient.family_relation:null,
            type: INPUT_FIELD,
        },{
            label: "Position",
            key: "position",
            type: SELECT_FIELD,
            //initialValue:this.props.currentPatient?this.props.currentPatient.gender:null,
            options: [{label: "standing", value: "standing"}, {label: "sitting", value: "sitting"}]
        },  {
            label: "Weight",
            key: "weight",
        //    initialValue:this.props.currentPatient?this.props.currentPatient.primary_mobile_no:null,
            type: INPUT_FIELD,
        }, {
            label: "Resp Rate",
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
            action:  interpolate(VITAL_SIGNS_API, [this.props.match.params.id]),
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
